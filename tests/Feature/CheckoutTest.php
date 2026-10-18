<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->category = Category::query()->create([
        'name' => 'Supplements',
        'slug' => 'supplements',
        'is_active' => true,
    ]);

    $category = $this->category;

    $this->makeProduct = fn (array $overrides = []): Product => Product::query()->create(array_merge([
        'category_id' => $category->id,
        'name' => 'Test Magnesium',
        'slug' => 'test-magnesium',
        'sku' => 'TEST-001',
        'price' => 1750,
        'stock_quantity' => 2,
        'stock_status' => 'limited',
        'catalog_visibility' => 'visible',
        'is_active' => true,
        'sold_individually' => false,
    ], $overrides));
});

$checkoutDetails = fn (int $productId, int $quantity): array => [
    'customer_name' => 'Amina Test',
    'customer_phone' => '0724151522',
    'customer_email' => 'amina@example.test',
    'delivery_address' => '12 Test Lane, Apartment 4',
    'delivery_area' => 'Nairobi',
    'delivery_notes' => 'Call on arrival',
    'items' => [[
        'id' => $productId,
        'quantity' => $quantity,
        'price' => 1,
    ]],
];

test('checkout creates a database-priced order and reserves stock', function () use ($checkoutDetails) {
    $product = ($this->makeProduct)(['price' => 1750, 'stock_quantity' => 2]);

    $response = $this->post(route('checkout.store'), $checkoutDetails($product->id, 2));

    $order = Order::query()->firstOrFail();

    $response->assertRedirect(route('checkout.confirmation', $order->reference));
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'subtotal' => 3500,
        'status' => 'pending',
        'payment_status' => 'unpaid',
        'delivery_fee' => null,
        'total' => null,
    ]);
    $this->assertDatabaseHas('order_items', [
        'order_id' => $order->id,
        'product_id' => $product->id,
        'unit_price' => 1750,
        'quantity' => 2,
        'line_total' => 3500,
    ]);
    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'stock_quantity' => 2,
        'stock_status' => 'limited',
    ]);

    $this->getJson(route('cart.availability', $product->id))
        ->assertOk()
        ->assertJsonPath('purchasable', false)
        ->assertJsonPath('max_quantity', 0);

    $this->get(route('checkout.confirmation', $order->reference))
        ->assertInertia(fn (Assert $page) => $page
            ->component('checkout/confirmation')
            ->where('order.order_number', $order->order_number)
            ->where('whatsapp_url', fn (string $url): bool => str_starts_with($url, 'https://wa.me/254724151522?text=')
                && str_contains(urldecode($url), '12 Test Lane, Apartment 4'))
        );

    $this->travel(2)->hours();

    $this->getJson(route('cart.availability', $product->id))
        ->assertOk()
        ->assertJsonPath('purchasable', true)
        ->assertJsonPath('max_quantity', 2);

    $this->get(route('checkout.confirmation', $order->reference))
        ->assertInertia(fn (Assert $page) => $page
            ->component('checkout/confirmation')
            ->where('order.reservation_expired', true)
            ->where('whatsapp_url', fn (string $url): bool => str_contains(
                urldecode($url),
                'Please confirm current stock before arranging payment.',
            ))
        );
});

test('checkout rejects a quantity above current stock without creating an order', function () use ($checkoutDetails) {
    $product = ($this->makeProduct)(['stock_quantity' => 1]);

    $this->from(route('checkout.create'))
        ->post(route('checkout.store'), $checkoutDetails($product->id, 2))
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('orders', 0);
    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'stock_quantity' => 1,
    ]);
});

test('checkout rejects products without confirmed stock', function () use ($checkoutDetails) {
    $product = ($this->makeProduct)([
        'stock_quantity' => null,
        'stock_status' => 'in_stock',
    ]);

    $this->from(route('checkout.create'))
        ->post(route('checkout.store'), $checkoutDetails($product->id, 1))
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('orders', 0);
    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'stock_quantity' => null,
    ]);
});
