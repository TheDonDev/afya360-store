<?php

use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StorefrontController::class, 'index'])
    ->name('home');

Route::get('/products/{product:slug}', [
    StorefrontController::class,
    'show',
])->name('products.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')
        ->name('dashboard');
});

require __DIR__.'/settings.php';
