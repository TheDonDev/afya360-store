#!/usr/bin/env python3
"""
Scrape mydawa.com product URLs from mydawa_export_state.json
and generate a CSV file matching the Laravel database schema.

Output CSV columns match the existing mydawa-products.csv format:
Explicit URL,Type,Published,Is featured?,Visibility in catalog,
Tax status,In stock?,Backorders allowed?,Sold individually?,
Allow customer reviews?,Parent,Categories,Images,Vendor,Name,
SKU,Regular price,Stock,Short description,Description
"""

import json
import csv
import re
import sys
import time
import urllib.request
import urllib.error
from urllib.parse import urlparse

JSON_FILE = "mydawa_export_state.json"
OUTPUT_CSV = "storage/app/imports/mydawa-products-scraped.csv"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-KE,en;q=0.9",
    "Referer": "https://mydawa.com/products/",
}


def fetch_html(url, retries=3):
    """Fetch raw HTML from a URL with retry logic."""
    last_error = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except (urllib.error.URLError, OSError) as e:
            last_error = e
            wait = (attempt + 1) * 5
            print(f"  Retry {attempt + 1}/{retries} for {url} in {wait}s: {e}", file=sys.stderr)
            time.sleep(wait)
    raise last_error


def extract_jsonld(html, type_name="Product"):
    """Extract JSON-LD script content for a given @type."""
    pattern = (
        r'<script type="application/ld\+json">\s*'
        r'(\{.*?"@type"\s*:\s*"' + type_name + r'".*?\})'
        r'\s*</script>'
    )
    matches = re.findall(pattern, html, re.DOTALL)
    if not matches:
        return None
    try:
        return json.loads(matches[0])
    except json.JSONDecodeError:
        return None


def extract_breadcrumbs(html):
    """Extract breadcrumb category path from JSON-LD."""
    breadcrumbs = extract_jsonld(html, "BreadcrumbList")
    if not breadcrumbs:
        return []
    items = breadcrumbs.get("itemListElement", [])
    return [item.get("name", "") for item in items if item.get("name")]


def extract_description(html):
    """Extract product description from pd-content-box div."""
    m = re.search(
        r'<div class="pd-content-box">(.*?)</div>\s*</div>',
        html,
        re.DOTALL,
    )
    if m:
        text = re.sub(r"<[^>]+>", "", m.group(1))
        text = re.sub(r"\s+", " ", text).strip()
        return text
    m = re.search(
        r'<div class="pd-overview-body pd-content-box">(.*?)</div>',
        html,
        re.DOTALL,
    )
    if m:
        text = re.sub(r"<[^>]+>", "", m.group(1))
        text = re.sub(r"\s+", " ", text).strip()
        return text
    return ""


def extract_stock_text(html):
    """Extract stock availability text from pd-info div."""
    m = re.search(
        r'<div class="pd-info">(.*?)</div>',
        html,
        re.DOTALL,
    )
    if m:
        text = re.sub(r"<[^>]+>", "", m.group(1))
        text = re.sub(r"\s+", " ", text).strip()
        return text
    return ""


def load_scraped_urls():
    """Load already-scraped URLs from existing CSV to avoid re-scraping."""
    scraped = set()
    try:
        with open(OUTPUT_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                scraped.add(row.get("Explicit URL", ""))
    except FileNotFoundError:
        pass
    return scraped


def scrape_product(url):
    """Scrape a single product page and return a dict of fields."""
    print(f"Scraping: {url}", file=sys.stderr)
    html = fetch_html(url)

    product = extract_jsonld(html, "Product")
    if not product:
        print(f"  WARNING: No Product JSON-LD found for {url}", file=sys.stderr)
        return None

    name = (product.get("name") or "").strip()
    sku = str(product.get("sku") or "").strip()
    brand = ""
    if product.get("brand"):
        if isinstance(product["brand"], dict):
            brand = product["brand"].get("name", "").strip()
        else:
            brand = str(product["brand"]).strip()

    offers = product.get("offers") or {}
    price = offers.get("price", 0)
    try:
        price = float(price)
    except (TypeError, ValueError):
        price = 0.0

    availability = offers.get("availability", "")
    if "InStock" in str(availability):
        stock_status = "in_stock"
        stock_text = "In Stock"
    elif "OutOfStock" in str(availability):
        stock_status = "out_of_stock"
        stock_text = "Out of Stock"
    else:
        stock_status = "in_stock"
        stock_text = "Availability varies"

    page_stock = extract_stock_text(html)
    if page_stock:
        stock_text = page_stock

    images = product.get("image", [])
    if isinstance(images, str):
        images = [images]
    elif not isinstance(images, list):
        images = []
    image_urls = [img for img in images if img]
    all_images = ",".join(image_urls)

    short_desc = product.get("description", "").strip()
    full_desc = extract_description(html)

    breadcrumbs = extract_breadcrumbs(html)
    categories_str = ">".join(breadcrumbs) if breadcrumbs else ""

    parsed = urlparse(url)
    path_parts = [p for p in parsed.path.split("/") if p]
    source_category = path_parts[-2] if len(path_parts) >= 2 else ""

    result = {
        "Explicit URL": url,
        "Type": "simple",
        "Published": "1",
        "Is featured?": "0",
        "Visibility in catalog": "visible",
        "Tax status": "taxable",
        "In stock?": "1" if stock_status == "in_stock" else "0",
        "Backorders allowed?": "0",
        "Sold individually?": "0",
        "Allow customer reviews?": "1",
        "Parent": "",
        "Categories": categories_str,
        "Images": all_images,
        "Vendor": brand,
        "Name": name,
        "SKU": sku,
        "Regular price": f"KES {price:,.0f}" if price else "KES 0",
        "Stock": stock_text,
        "Short description": short_desc,
        "Description": full_desc,
    }
    return result


def main():
    with open(JSON_FILE, "r") as f:
        data = json.load(f)

    urls = data.get("completed", [])
    print(f"Found {len(urls)} product URLs in JSON file", file=sys.stderr)

    scraped_urls = load_scraped_urls()
    print(f"Already scraped: {len(scraped_urls)} URLs", file=sys.stderr)

    remaining_urls = [u for u in urls if u not in scraped_urls]
    print(f"Remaining to scrape: {len(remaining_urls)} URLs", file=sys.stderr)

    if not remaining_urls:
        print("All URLs already scraped!", file=sys.stderr)
        return

    # Load existing results to append
    existing_results = []
    existing_fieldnames = []
    try:
        with open(OUTPUT_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            existing_fieldnames = reader.fieldnames or []
            for row in reader:
                existing_results.append(row)
    except FileNotFoundError:
        pass

    results = []
    failed = []
    for i, url in enumerate(remaining_urls, 1):
        try:
            product = scrape_product(url)
            if product:
                results.append(product)
                print(f"  [{i}/{len(remaining_urls)}] OK: {product['Name']} ({product['SKU']})", file=sys.stderr)
            else:
                failed.append(url)
                print(f"  [{i}/{len(remaining_urls)}] FAILED: {url}", file=sys.stderr)
        except Exception as e:
            failed.append(url)
            print(f"  [{i}/{len(remaining_urls)}] ERROR: {url} - {e}", file=sys.stderr)
        time.sleep(3)

    all_results = existing_results + results

    if all_results:
        fieldnames = existing_fieldnames or list(results[0].keys())
        mode = "a" if existing_results else "w"
        with open(OUTPUT_CSV, mode, newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if mode == "w":
                writer.writeheader()
            writer.writerows(results)
        print(f"\nWrote {len(results)} new products to {OUTPUT_CSV}", file=sys.stderr)
        print(f"Total products in CSV: {len(all_results)}", file=sys.stderr)
    else:
        print("No new products scraped!", file=sys.stderr)

    if failed:
        print(f"\n{len(failed)} URLs still failed:", file=sys.stderr)
        for url in failed:
            print(f"  {url}", file=sys.stderr)


if __name__ == "__main__":
    main()
