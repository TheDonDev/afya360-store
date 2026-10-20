<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\AiChatbotController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

// Customer care pages
Route::get('/customer-care/about', function () {
    return Inertia::render('customer-care/about');
})->name('customer-care.about');

Route::get('/customer-care/contact', function () {
    return Inertia::render('customer-care/contact');
})->name('customer-care.contact');

Route::get('/customer-care/delivery-returns', function () {
    return Inertia::render('customer-care/delivery-returns');
})->name('customer-care.delivery-returns');

Route::get('/customer-care/privacy-policy', function () {
    return Inertia::render('customer-care/privacy-policy');
})->name('customer-care.privacy-policy');

Route::get('/customer-care/terms-of-service', function () {
    return Inertia::render('customer-care/terms-of-service');
})->name('customer-care.terms-of-service');

// AI Chatbot API
Route::post('/api/ai-chatbot/chat', [AiChatbotController::class, 'chat'])
    ->name('api.ai-chatbot.chat');

require __DIR__.'/settings.php';
