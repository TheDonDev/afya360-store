#!/usr/bin/env python3
"""
Classify all scraped products into Categories and Subcategories based on
URL path and product name keywords.

Subcategories covered:
- Skincare: Face Care, Cleansers, Moisturisers, Serums, Sunscreen, Body Care
- Cosmetics: Beauty & Lifestyle, Cosmetics
- Hair & Body: Hair Care, Shampoo & Conditioner, Treatments & Masks, Body Care, Bath & Shower, Deodorants
- Supplements: Vitamins & Supplements, Food & Drink, Sports
"""

import csv
import re
from urllib.parse import urlparse
from collections import Counter

INPUT_CSV = "storage/app/imports/mydawa-products-scraped.csv"
OUTPUT_CSV = "storage/app/imports/mydawa-products-scraped.csv"

VALID_SUBCATEGORIES = {
    'Skincare': ['Face Care', 'Cleansers', 'Moisturisers', 'Serums', 'Sunscreen', 'Body Care'],
    'Hair & Body': ['Hair Care', 'Shampoo & Conditioner', 'Treatments & Masks', 'Body Care', 'Bath & Shower', 'Deodorants'],
    'Supplements': ['Vitamins & Supplements', 'Food & Drink', 'Sports'],
    'Cosmetics': ['Beauty & Lifestyle', 'Cosmetics'],
}

# Name keyword -> (main_category, subcategory)
# Check longer/more specific keywords first
NAME_KEYWORDS = [
    # === SKINCARE (non-baby) ===
    (['cleanser', 'cleansing', 'face wash', 'facewash', 'micellar', 'foam cleanser'], 'Skincare', 'Cleansers'),
    (['serum'], 'Skincare', 'Serums'),
    (['moisturiser', 'moisturizing', 'moisturising', 'moisturizer', 'night cream', 'day cream', 'face cream', 'balm'], 'Skincare', 'Moisturisers'),
    (['sunscreen', 'spf', 'sunblock', 'sun care'], 'Skincare', 'Sunscreen'),
    (['body lotion', 'body cream', 'body butter'], 'Skincare', 'Body Care'),
    (['face', 'skin', 'pigment', 'anti-aging', 'antiageing', 'acne', 'blemish', 'rosacea', 'eczema', 'psoriasis'], 'Skincare', 'Face Care'),

    # === HAIR & BODY ===
    # Baby products (hair & body care)
    (['baby lotion', 'baby cream', 'baby oil', 'baby jelly', 'petroleum jelly'], 'Hair & Body', 'Body Care'),
    (['baby powder', 'baby balm'], 'Hair & Body', 'Body Care'),
    # Hair Care
    (['hair care'], 'Hair & Body', 'Hair Care'),
    (['shampoo'], 'Hair & Body', 'Shampoo & Conditioner'),
    (['conditioner'], 'Hair & Body', 'Shampoo & Conditioner'),
    (['hair mask', 'hair treatment'], 'Hair & Body', 'Treatments & Masks'),
    # Body Care
    (['body wash', 'body soap', 'body wash'], 'Hair & Body', 'Body Care'),
    (['deodorant'], 'Hair & Body', 'Deodorants'),
    # Bath & Shower
    (['bath', 'shower', 'bubble bath'], 'Hair & Body', 'Bath & Shower'),
    # General baby -> Body Care
    (['baby'], 'Hair & Body', 'Body Care'),

    # === SUPPLEMENTS ===
    (['vitamin', 'glutathione', 'magnesium', 'omega', 'fish oil', 'probiotic', 'mineral', 'capsule', 'tablet'], 'Supplements', 'Vitamins & Supplements'),
    (['supplement'], 'Supplements', 'Vitamins & Supplements'),
    (['formula', 'milk', 'nutrition', 'food', 'meal'], 'Supplements', 'Food & Drink'),
    (['sports', 'protein', 'workout', 'fitness'], 'Supplements', 'Sports'),

    # === COSMETICS ===
    (['lip', 'gloss', 'makeup', 'make-up', 'cosmetic'], 'Cosmetics', 'Cosmetics'),
    (['beauty', 'lifestyle'], 'Cosmetics', 'Beauty & Lifestyle'),
]

# URL path segment -> (main_category, subcategory)
URL_PATH_KEYWORDS = [
    # Skincare (non-baby paths only)
    (['face-care'], 'Skincare', 'Face Care'),
    (['cleansers'], 'Skincare', 'Cleansers'),
    (['moisturisers'], 'Skincare', 'Moisturisers'),
    (['serums'], 'Skincare', 'Serums'),
    (['sunscreen'], 'Skincare', 'Sunscreen'),
    # Hair & Body
    (['hair-care'], 'Hair & Body', 'Hair Care'),
    (['shampoo'], 'Hair & Body', 'Shampoo & Conditioner'),
    (['conditioner'], 'Hair & Body', 'Shampoo & Conditioner'),
    (['treatments', 'masks'], 'Hair & Body', 'Treatments & Masks'),
    (['bath', 'shower'], 'Hair & Body', 'Bath & Shower'),
    (['deodorant'], 'Hair & Body', 'Deodorants'),
    (['body-wash', 'soap'], 'Hair & Body', 'Body Care'),
    # Supplements
    (['supplements'], 'Supplements', 'Vitamins & Supplements'),
    (['nutrition'], 'Supplements', 'Food & Drink'),
    (['mens-health', 'glutathione', 'magnesium', 'menopause'], 'Supplements', 'Vitamins & Supplements'),
    # Cosmetics
    (['make-up', 'lip-care', 'lip'], 'Cosmetics', 'Cosmetics'),
]

DEFAULT_MAP = {
    'Skincare': 'Face Care',
    'Hair & Body': 'Body Care',
    'Supplements': 'Vitamins & Supplements',
    'Cosmetics': 'Cosmetics',
}


def classify_product(url, name, current_category):
    """Classify a product into category and subcategory based on URL and name."""
    name_lower = name.lower().strip()
    parsed = urlparse(url)
    path_parts = [p.lower() for p in parsed.path.split('/') if p]

    # Determine main category from current_category (strip any existing subcategory)
    main_cat = 'Skincare'
    if current_category:
        parts = [p.strip() for p in current_category.split('>')]
        if parts[0] in VALID_SUBCATEGORIES:
            main_cat = parts[0]

    subcat = None

    # Step 1: Check product name keywords first (most reliable)
    for keywords, cat, sub in NAME_KEYWORDS:
        if any(kw in name_lower for kw in keywords):
            main_cat = cat
            subcat = sub
            break

    # Step 2: If not found from name, check URL path segments
    if not subcat:
        for part in path_parts:
            for keywords, cat, sub in URL_PATH_KEYWORDS:
                if any(kw == part or kw in part for kw in keywords):
                    main_cat = cat
                    subcat = sub
                    break
            if subcat:
                break

    # Step 3: Validate subcategory belongs to the main category
    valid_subcats = VALID_SUBCATEGORIES.get(main_cat, [])
    if subcat and subcat not in valid_subcats:
        subcat = None
        for valid in valid_subcats:
            if valid.lower() in name_lower:
                subcat = valid
                break

    # Step 4: Default subcategory
    if not subcat:
        subcat = DEFAULT_MAP.get(main_cat, 'Face Care')

    # Build source_category string like "Skincare > Face Care"
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
        row['source_category'] = subcat
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
