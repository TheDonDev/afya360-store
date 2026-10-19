<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->with('category:id,name,slug')
            ->where('is_active', true)
            ->where('catalog_visibility', 'visible')
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'brand' => $product->brand ?: $product->category->name,
                'category' => $product->category->name,
                'source_category' => $product->source_category,
                'price' => (float) $product->price,
                'image' => $product->image_url,
                'label' => $product->badge,
                'stock_quantity' => $product->stock_quantity,
                'stock_status' => $product->stock_status,
            ])
            ->values();

        return Inertia::render('welcome', [
            'products' => $products,
        ]);
    }

    public function catalogue(): Response
    {
        $products = Product::query()
            ->with('category:id,name,slug')
            ->where('is_active', true)
            ->where('catalog_visibility', 'visible')
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'brand' => $product->brand ?: $product->category->name,
                'category' => $product->category->name,
                'source_category' => $product->source_category,
                'price' => (float) $product->price,
                'image' => $product->image_url,
                'label' => $product->badge,
                'stock_quantity' => $product->stock_quantity,
                'stock_status' => $product->stock_status,
            ])
            ->values();

        return Inertia::render('products/catalogue', [
            'products' => $products,
        ]);
    }

    public function show(Product $product): Response
    {
        abort_unless(
            $product->is_active
                && $product->catalog_visibility === 'visible',
            404
        );

        $product->load('category:id,name,slug');

        $images = collect($product->images ?? [])
            ->filter(fn ($image) => is_string($image) && $image !== '')
            ->prepend($product->image_url)
            ->filter(fn ($image) => is_string($image) && $image !== '')
            ->unique()
            ->values();

        return Inertia::render('products/show', [
            'product' => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'sku' => $product->sku,
                'brand' => $product->brand ?: $product->category->name,
                'category' => [
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ],
                'short_description' => $product->short_description,
                'description' => $product->description,
                'price' => (float) $product->price,
                'compare_at_price' => $product->compare_at_price !== null
                    ? (float) $product->compare_at_price
                    : null,
                'images' => $images,
                'stock_quantity' => $product->stock_quantity,
                'stock_status' => $product->stock_status,
                'source_stock_text' => $product->source_stock_text,
                'allow_customer_reviews' => $product->allow_customer_reviews,
            ],
        ]);
    }
}
