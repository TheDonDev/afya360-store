<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('brand')->nullable();
            $table->string('source_url')->nullable();
            $table->string('source_category')->nullable();
            $table->string('source_stock_text')->nullable();
            $table->string('stock_status')->default('unknown');
            $table->string('catalog_visibility')->nullable();
            $table->string('tax_status')->nullable();
            $table->boolean('backorders_allowed')->default(false);
            $table->boolean('sold_individually')->default(false);
            $table->boolean('allow_customer_reviews')->default(false);
            $table->json('images')->nullable();
            $table->json('source_data')->nullable();

            $table->unsignedInteger('stock_quantity')
                ->nullable()
                ->default(null)
                ->change();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);

            $table->unsignedInteger('stock_quantity')
                ->nullable(false)
                ->default(0)
                ->change();
        });
    }
};