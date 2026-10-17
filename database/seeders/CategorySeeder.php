<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Skincare',
                'slug' => 'skincare',
                'description' => 'Everyday skincare essentials.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Cosmetics',
                'slug' => 'cosmetics',
                'description' => 'Beauty products for your routine.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Hair & Body',
                'slug' => 'hair-body',
                'description' => 'Care from head to toe.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Supplements',
                'slug' => 'supplements',
                'description' => 'Wellness products for everyday life.',
                'sort_order' => 4,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                array_merge($category, ['is_active' => true])
            );
        }
    }
}
