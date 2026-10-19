<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

class MyDawaProductSeeder extends Seeder
{
    public function run(): void
    {
        $path = storage_path('app/imports/mydawa-products.csv');

        if (! is_file($path)) {
            throw new RuntimeException(
                "CSV file not found: {$path}"
            );
        }

        $handle = fopen($path, 'r');

        if ($handle === false) {
            throw new RuntimeException('Unable to open the CSV file.');
        }

        try {
            $headers = fgetcsv($handle, 0, ',', '"', '');

            if ($headers === false) {
                throw new RuntimeException('The CSV file is empty.');
            }

            $headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', $headers[0]);
            $headers = array_map('trim', $headers);

            $imported = 0;

            while (($values = fgetcsv($handle, 0, ',', '"', '')) !== false) {
                if (count($values) !== count($headers)) {
                    throw new RuntimeException(
                        'A CSV row has a different number of columns.'
                    );
                }

                $row = array_combine($headers, $values);

                $name = trim($row['Name'] ?? '');

                if ($name === '') {
                    continue;
                }

                $sku = trim($row['SKU'] ?? '');
                $priceText = trim($row['Regular price'] ?? '');
                $price = (float) str_replace(
                    ',',
                    '',
                    preg_replace('/[^0-9,.]/', '', $priceText)
                );

                if ($price <= 0) {
                    // Skip products with no price (out of stock items)
                    continue;
                }

                $stockText = trim($row['Stock'] ?? '');
                $quantity = null;

                if (preg_match(
                    '/Only\s+(\d+)\s+left/i',
                    $stockText,
                    $matches
                )) {
                    $quantity = (int) $matches[1];
                }

                $stockStatus = $quantity !== null
                    ? 'limited'
                    : (stripos($stockText, 'in stock') !== false
                        ? 'in_stock'
                        : 'unknown');

                $sourceCategory = trim($row['Categories'] ?? '');
                $categoryText = strtolower($sourceCategory);
                $nameText = strtolower($name);

                // Map CSV categories to site category slugs
                $categorySlugMap = [
                    'skincare' => 'skincare',
                    'cosmetics' => 'cosmetics',
                    'hair & body' => 'hair-body',
                    'supplements' => 'supplements',
                ];
                $categorySlug = $categorySlugMap[$categoryText] ?? null;

                // Fallback: keyword-based mapping
                if (!$categorySlug) {
                    if (str_contains($nameText, 'tilla hair')
                        || str_contains($nameText, 'body care')) {
                        $categorySlug = 'hair-body';
                    } elseif (str_contains($categoryText, 'make up')) {
                        $categorySlug = 'cosmetics';
                    } elseif (
                        str_contains($categoryText, 'supplements')
                        || str_contains($categoryText, 'reproductive health')
                        || str_contains($nameText, 'horny goat weed')
                        || str_contains($nameText, 'glutathione')
                        || str_contains($nameText, 'magnesium glycinate')
                        || str_contains($nameText, 'menopause support')
                    ) {
                        $categorySlug = 'supplements';
                    } else {
                        $categorySlug = 'skincare';
                    }
                }

                $category = Category::where(
                    'slug',
                    $categorySlug
                )->firstOrFail();

                $images = array_values(array_filter(array_map(
                    'trim',
                    explode(',', $row['Images'] ?? '')
                )));

                $published = (string) ($row['Published'] ?? '0') === '1';
                $visible = strtolower(
                    trim($row['Visibility in catalog'] ?? '')
                ) === 'visible';

                $slug = Str::slug($name);

                $data = [
                    'category_id' => $category->id,
                    'name' => $name,
                    'slug' => $slug,
                    'sku' => $sku !== '' ? $sku : null,
                    'brand' => trim($row['Vendor'] ?? '') ?: null,
                    'source_url' => trim($row['Explicit URL'] ?? '') ?: null,
                    'source_category' => $sourceCategory ?: null,
                    'source_stock_text' => $stockText ?: null,
                    'stock_status' => $stockStatus,
                    'catalog_visibility' => trim(
                        $row['Visibility in catalog'] ?? ''
                    ) ?: null,
                    'tax_status' => trim($row['Tax status'] ?? '') ?: null,
                    'backorders_allowed' =>
                        (string) ($row['Backorders allowed?'] ?? '0') === '1',
                    'sold_individually' =>
                        (string) ($row['Sold individually?'] ?? '0') === '1',
                    'allow_customer_reviews' =>
                        (string) ($row['Allow customer reviews?'] ?? '0') === '1',
                    'short_description' =>
                        trim($row['Short description'] ?? '') ?: null,
                    'description' =>
                        trim($row['Description'] ?? '') ?: null,
                    'price' => $price,
                    'compare_at_price' => null,
                    'stock_quantity' => $quantity,
                    'image_url' => $images[0] ?? null,
                    'images' => $images,
                    'source_data' => $row,
                    'is_featured' =>
                        (string) ($row['Is featured?'] ?? '0') === '1',
                    'is_active' => $published && $visible,
                ];

                if ($sku !== '') {
                    Product::updateOrCreate(
                        ['sku' => $sku],
                        $data
                    );
                } else {
                    Product::updateOrCreate(
                        ['slug' => $slug],
                        $data
                    );
                }

                $imported++;
            }

            $this->command?->info(
                "Imported or updated {$imported} CSV products."
            );
        } finally {
            fclose($handle);
        }
    }
}