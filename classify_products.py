#!/usr/bin/env python3
"""
Classify all scraped products into Categories and Subcategories based on
URL path and product name keywords.

Updates the mydawa-products-scraped.csv with proper source_category values
that include subcategory info (e.g., "Skincare > Face Care > Moisturisers").
"""

import csv
import re
from urllib.parse import urlparse
from collections import Counter

INPUT_CSV = "storage/app/imports/mydawa-products-scraped.csv"
OUTPUT_CSV = "storage/app/imports/mydawa-products-scraped.csv"

# Subcategory mapping based on URL path segments
URL_SUBCATEGORY_MAP = {
    # Skincare subcategories
    'face-care': 'Face Care',
    'cleansers': 'Cleansers',
    'moisturisers': 'Moisturisers',
    'serums': 'Serums',
    'sunscreen': 'Sunscreen',
    'body-care': 'Body Care',
    'face-creams': 'Face Care',
    'face-wash': 'Cleansers',
    'skin-care': 'Face Care',
    # Hair & Body subcategories
    'hair-care': 'Hair Care',
    'shampoo': 'Shampoo & Conditioner',
    'conditioner': 'Shampoo & Conditioner',
    'treatments': 'Treatments & Masks',
    'masks': 'Treatments & Masks',
    'bath': 'Bath & Shower',
    'shower': 'Bath & Shower',
    'deodorant': 'Deodorants',
    'body-wash': 'Body Care',
    'soap': 'Body Care',
    'baby-wash': 'Bath & Shower',
    'baby-soap': 'Body Care',
    'baby-lotion': 'Body Care',
    'baby-cream': 'Body Care',
    'baby-oil': 'Body Care',
    # Supplements subcategories
    'supplements': 'Vitamins & Supplements',
    'nutrition': 'Food & Drink',
    'mens-health': 'Vitamins & Supplements',
    'glutathione': 'Vitamins & Supplements',
    'magnesium': 'Vitamins & Supplements',
    'menopause': 'Vitamins & Supplements',
    # Cosmetics subcategories
    'make-up': 'Cosmetics',
    'lip-care': 'Cosmetics',
    'lip': 'Cosmetics',
}

# Subcategory mapping based on product name keywords
NAME_SUBCATEGORY_MAP = {
    # Skincare
    'cleanser': 'Cleansers',
    'cleansing': 'Cleansers',
    'wash': 'Cleansers',
    'serum': 'Serums',
    'moisturiser': 'Moisturisers',
    'moisturizing': 'Moisturisers',
    'moisturising': 'Moisturisers',
    'cream': 'Moisturisers',
    'lotion': 'Moisturisers',
    'sunscreen': 'Sunscreen',
    'spf': 'Sunscreen',
    'sun': 'Sunscreen',
    # Hair & Body
    'shampoo': 'Shampoo & Conditioner',
    'conditioner': 'Shampoo & Conditioner',
    'soap': 'Body Care',
    'body wash': 'Body Care',
    'body-care': 'Body Care',
    'baby': 'Bath & Shower',
    'bath': 'Bath & Shower',
    'hair': 'Hair Care',
    # Supplements
    'vitamin': 'Vitamins & Supplements',
    'supplement': 'Vitamins & Supplements',
    'capsule': 'Vitamins & Supplements',
    'tablet': 'Vitamins & Supplements',
    'formula': 'Food & Drink',
    # Cosmetics
    'lip': 'Cosmetics',
    'gloss': 'Cosmetics',
    'makeup': 'Cosmetics',
    'make-up': 'Cosmetics',
    'cosmetic': 'Cosmetics',
}

CATEGORY_SUBCATEGORIES = {
    'Skincare': [
        'Face Care', 'Cleansers', 'Moisturisers', 'Serums', 'Sunscreen', 'Body Care'
    ],
    'Hair & Body': [
        'Hair Care', 'Shampoo & Conditioner', 'Treatments & Masks',
        'Body Care', 'Bath & Shower', 'Deodorants'
    ],
    'Supplements': [
        'Vitamins & Supplements', 'Food & Drink', 'Sports'
    ],
    'Cosmetics': [
        'Beauty & Lifestyle', 'Cosmetics'
    ],
}


def classify_product(url, name, current_category):
    """Classify a product into category and subcategory based on URL and name."""
    name_lower = name.lower()
    parsed = urlparse(url)
    path_parts = [p.lower() for p in parsed.path.split('/') if p]
    # path: /products/{category1}/{category2}/{product-slug}

    # Determine main category
    if current_category:
        main_cat = current_category
    else:
        main_cat = 'Skincare'  # default

    # Determine subcategory from URL path
    subcat = None
    if len(path_parts) >= 3:
        # path_parts[1] = first level category, path_parts[2] = second level
        for i, part in enumerate(path_parts[1:], start=1):
            if part in URL_SUBCATEGORY_MAP:
                subcat = URL_SUBCATEGORY_MAP[part]
                break
            # Also check partial matches
            for kw, mapped in URL_SUBCATEGORY_MAP.items():
                if kw in part:
                    subcat = mapped
                    break
            if subcat:
                break

    # If not found from URL, check name keywords
    if not subcat:
        for kw, mapped in NAME_SUBCATEGORY_MAP.items():
            if kw in name_lower:
                subcat = mapped
                break

    # Validate subcategory belongs to the main category
    valid_subcats = CATEGORY_SUBCATEGORIES.get(main_cat, [])
    if subcat and subcat not in valid_subcats:
        # Try to find a valid subcategory for this main category
        subcat = None
        for valid in valid_subcats:
            if valid.lower() in name_lower or any(
                kw in name_lower for kw in valid.lower().split()
            ):
                subcat = valid
                break

    # Default subcategory if none found
    if not subcat:
        default_map = {
            'Skincare': 'Face Care',
            'Hair & Body': 'Body Care',
            'Supplements': 'Vitamins & Supplements',
            'Cosmetics': 'Cosmetics',
        }
        subcat = default_map.get(main_cat, 'Face Care')

    # Build source_category string like "Skincare > Face Care > Moisturisers"
    source_category = f"{main_cat} > {subcat}"
    return main_cat, source_category, subcat


def main():
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames)
        if 'source_category' not in fieldnames:
            fieldnames.append('source_category')
        rows = list(reader)

    updated = 0
    for row in rows:
        url = row.get('Explicit URL', '')
        name = row.get('Name', '')
        current_cat = row.get('Categories', '').strip()

        main_cat, source_category, subcat = classify_product(
            url, name, current_cat
        )

        row['Categories'] = source_category
        row['source_category'] = subcat  # store subcategory separately
        updated += 1

    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Updated {updated} rows with categories and subcategories")

    # Show distribution
    cat_subcat_counter = Counter()
    for row in rows:
        cat = row.get('Categories', 'Unknown')
        cat_subcat_counter[cat] += 1

    for cat_subcat, count in cat_subcat_counter.most_common():
        print(f"  {count:3d} | {cat_subcat}")


if __name__ == "__main__":
    main()
