<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'category' => 'skincare',
                'name' => 'Hydrating Face Serum',
                'slug' => 'hydrating-face-serum',
                'sku' => 'AFY-SKIN-001',
                'short_description' => 'A skincare routine essential.',
                'price' => 1850,
                'badge' => 'Bestseller',
                'is_featured' => true,
            ],
            [
                'category' => 'skincare',
                'name' => 'Nourishing Face Cream',
                'slug' => 'nourishing-face-cream',
                'sku' => 'AFY-SKIN-002',
                'short_description' => 'An everyday moisturising essential.',
                'price' => 2200,
                'badge' => 'Popular',
                'is_featured' => true,
            ],
            [
                'category' => 'cosmetics',
                'name' => 'Everyday Beauty Essentials',
                'slug' => 'everyday-beauty-essentials',
                'sku' => 'AFY-COS-001',
                'short_description' => 'Beauty essentials for everyday use.',
                'price' => 1600,
                'is_featured' => true,
            ],
            [
                'category' => 'hair-body',
                'name' => 'Nourishing Body Care',
                'slug' => 'nourishing-body-care',
                'sku' => 'AFY-BODY-001',
                'short_description' => 'Body care for your daily routine.',
                'price' => 1350,
                'is_featured' => true,
            ],
            [
                'category' => 'supplements',
                'name' => 'Daily Wellness Essentials',
                'slug' => 'daily-wellness-essentials',
                'sku' => 'AFY-WELL-001',
                'short_description' => 'Explore everyday wellness products.',
                'price' => 2400,
                'is_featured' => true,
            ],
            [
                'category' => 'skincare',
                'name' => 'Gentle Daily Cleanser',
                'slug' => 'gentle-daily-cleanser',
                'sku' => 'AFY-SKIN-003',
                'short_description' => 'A cleanser for your skincare routine.',
                'price' => 1250,
                'is_featured' => false,
            ],
            [
                'category' => 'hair-body',
                'name' => 'Body Care Collection',
                'slug' => 'body-care-collection',
                'sku' => 'AFY-BODY-002',
                'short_description' => 'Body care essentials in one collection.',
                'price' => 1950,
                'is_featured' => false,
            ],
            [
                'category' => 'cosmetics',
                'name' => 'Beauty Glow Essentials',
                'slug' => 'beauty-glow-essentials',
                'sku' => 'AFY-COS-002',
                'short_description' => 'Beauty essentials for your collection.',
                'price' => 1750,
                'is_featured' => false,
            ],
        ];

        foreach ($products as $item) {
            $category = Category::where(
                'slug',
                $item['category']
            )->firstOrFail();

            unset($item['category']);

            Product::updateOrCreate(
                ['slug' => $item['slug']],
                array_merge($item, [
                    'category_id' => $category->id,
                    'stock_quantity' => 0,
                    'is_active' => true,
                ])
            );
        }
    }
}
