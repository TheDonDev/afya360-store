#!/usr/bin/env python3
"""
Post-process the scraped CSV to add category information from URL paths.
Maps mydawa.com URL categories to site categories:
- skincare -> Skincare
- cosmetics/make-up -> Cosmetics
- hair, body -> Hair & Body
- supplements, nutrition -> Supplements
"""

import csv
import re
from urllib.parse import urlparse

INPUT_CSV = "storage/app/imports/mydawa-products-scraped.csv"
OUTPUT_CSV = "storage/app/imports/mydawa-products-scraped.csv"

# URL path category hints to site category mapping
URL_CATEGORY_MAP = {
    'baby-cleaning-skin-care': 'Skincare',
    'baby-activity': 'Hair & Body',
    'baby-accessories': 'Hair & Body',
    'baby-feeding': 'Hair & Body',
    'baby-foods': 'Supplements',
    'baby-soaps': 'Skincare',
    'baby-lotions': 'Skincare',
    'baby-cream': 'Skincare',
    'baby-oils': 'Skincare',
    'supplements': 'Supplements',
    'nutrition': 'Supplements',
    'make-up': 'Cosmetics',
    'cosmetics': 'Cosmetics',
    'beauty': 'Cosmetics',
    'skin-care': 'Skincare',
    'skincare': 'Skincare',
    'hair-care': 'Hair & Body',
    'body-care': 'Hair & Body',
    'personal-care': 'Hair & Body',
    'reproductive-health': 'Supplements',
    'sexual': 'Supplements',
    'mens-health': 'Supplements',
    'womens-health': 'Supplements',
    'vitamins': 'Supplements',
    'glucosamine': 'Supplements',
    'omega': 'Supplements',
}

def categorize_from_url(url):
    """Map a product URL to a site category."""
    parsed = urlparse(url)
    path_parts = [p.lower() for p in parsed.path.split('/') if p]
    # path: /products/{category1}/{category2}/{product-slug}
    if len(path_parts) >= 3:
        cat1 = path_parts[1]
        cat2 = path_parts[2] if len(path_parts) > 2 else ''
        
        # Check direct mapping first
        if cat1 in URL_CATEGORY_MAP:
            return URL_CATEGORY_MAP[cat1]
        if cat2 in URL_CATEGORY_MAP:
            return URL_CATEGORY_MAP[cat2]
        
        # Keyword-based fallback
        combined = f"{cat1} {cat2}"
        if any(kw in combined for kw in ['supplement', 'nutrition', 'vitamin']):
            return 'Supplements'
        if any(kw in combined for kw in ['make-up', 'cosmetic', 'beauty', 'makeup']):
            return 'Cosmetics'
        if any(kw in combined for kw in ['hair', 'body', 'baby', 'personal']):
            return 'Hair & Body'
        if any(kw in combined for kw in ['skin', 'cleaning', 'care', 'lotion', 'cream', 'soap', 'oil']):
            return 'Skincare'
    
    return 'Skincare'  # Default fallback


def categorize_from_name(name):
    """Categorize based on product name keywords."""
    name_lower = name.lower()
    if any(kw in name_lower for kw in ['supplement', 'vitamin', 'glutathione', 'magnesium', 'horny', 'menopause', 'omega', 'protein']):
        return 'Supplements'
    if any(kw in name_lower for kw in ['make-up', 'cosmetic', 'lipstick', 'foundation', 'mascara', 'eyeshadow']):
        return 'Cosmetics'
    if any(kw in name_lower for kw in ['hair', 'shampoo', 'conditioner', 'body wash', 'body lotion', 'soap', 'baby']):
        return 'Hair & Body'
    return 'Skincare'


def main():
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    updated = 0
    for row in rows:
        categories = row.get('Categories', '').strip()
        if not categories:
            url = row.get('Explicit URL', '')
            name = row.get('Name', '')
            cat = categorize_from_url(url)
            if not cat:
                cat = categorize_from_name(name)
            row['Categories'] = cat
            updated += 1

    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Updated {updated} rows with categories")
    print(f"Total rows: {len(rows)}")

    # Show category distribution
    from collections import Counter
    cat_counts = Counter(row.get('Categories', 'Unknown') for row in rows)
    for cat, count in cat_counts.most_common():
        print(f"  {cat}: {count}")


if __name__ == "__main__":
    main()
