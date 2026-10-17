<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'short_description',
        'description',
        'price',
        'compare_at_price',
        'stock_quantity',
        'image_url',
        'badge',
        'is_featured',
        'is_active',
        'brand',
        'source_url',
        'source_category',
        'source_stock_text',
        'stock_status',
        'catalog_visibility',
        'tax_status',
        'backorders_allowed',
        'sold_individually',
        'allow_customer_reviews',
        'images',
        'source_data',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_at_price' => 'decimal:2',
            'stock_quantity' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'backorders_allowed' => 'boolean',
            'sold_individually' => 'boolean',
            'allow_customer_reviews' => 'boolean',
            'images' => 'array',
            'source_data' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
