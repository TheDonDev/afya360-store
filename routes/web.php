<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StorefrontController::class, 'index'])
    ->name('home');

Route::get('/products', [StorefrontController::class, 'catalogue'])
    ->name('products.catalogue');

Route::get('/products/{product:slug}', [
    StorefrontController::class,
    'show',
])->name('products.show');

Route::middleware('guest')->prefix('auth/google')->name('google.')->group(function () {
    Route::get('/redirect', [GoogleAuthController::class, 'redirect'])
        ->name('redirect');
    Route::get('/callback', [GoogleAuthController::class, 'callback'])
        ->name('callback');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')
        ->name('dashboard');
});

Route::get('/cart/availability/{product}', [
    CartController::class,
    'availability',
])->whereNumber('product')->name('cart.availability');

Route::get('/checkout', [CheckoutController::class, 'create'])
    ->name('checkout.create');
Route::post('/checkout', [CheckoutController::class, 'store'])
    ->name('checkout.store');
Route::get('/checkout/confirmation/{order:reference}', [
    CheckoutController::class,
    'confirmation',
])->name('checkout.confirmation');
Route::get('/checkout/visa/{order:reference}', [
    CheckoutController::class,
    'visaPayment',
])->name('checkout.visa');
Route::post('/checkout/webhook/visa', [
    CheckoutController::class,
    'visaWebhook',
])->name('checkout.visa.webhook');

Route::post('/api/visa/payment-intent', [
    CheckoutController::class,
    'visaPaymentIntent',
])->middleware('auth')->name('api.visa.payment-intent');

Route::get('/checkout/visa/success/{order:reference}', [
    CheckoutController::class,
    'visaSuccess',
])->name('checkout.visa.success');

require __DIR__.'/settings.php';
