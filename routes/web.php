<?php

use App\Http\Controllers\Client\OfferController as ClientOfferController;
use App\Http\Controllers\Client\OrderController as ClientOrderController;
use App\Http\Controllers\Client\PaymentController as ClientPaymentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AnalyticsController as AdminAnalyticsController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PharmacyController as AdminPharmacyController;
use App\Http\Controllers\Pharmacy\DashboardController as PharmacyDashboardController;
use App\Http\Controllers\Pharmacy\OrderController as PharmacyOrderController;
use App\Http\Controllers\Pharmacy\RequestController as PharmacyRequestController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Client
    Route::prefix('client')->name('client.')->group(function () {
        Route::inertia('/', 'client/dashboard')->name('dashboard');
        Route::get('/orders/new', [ClientOrderController::class, 'create'])->name('orders.new');
        Route::post('/orders', [ClientOrderController::class, 'store'])->name('orders.store');
        Route::get('/orders', [ClientOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [ClientOrderController::class, 'show'])->name('orders.show');
        Route::get('/orders/{order}/compare', [ClientOfferController::class, 'compare'])->name('offers.compare');
        Route::post('/orders/{order}/choose-offer', [ClientOfferController::class, 'chooseOffer'])->name('orders.choose-offer');
        Route::get('/orders/{order}/pay', [ClientPaymentController::class, 'show'])->name('orders.pay');
        Route::post('/orders/{order}/pay', [ClientPaymentController::class, 'store'])->name('orders.pay.store');
        Route::post('/orders/{order}/messages', [MessageController::class, 'store'])->name('orders.messages.store');
    });

    // Pharmacy
    Route::prefix('pharmacy')->name('pharmacy.')->group(function () {
        Route::get('/', PharmacyDashboardController::class)->name('dashboard');
        Route::get('/requests', [PharmacyRequestController::class, 'index'])->name('requests.index');
        Route::get('/requests/{order}', [PharmacyRequestController::class, 'show'])->name('requests.show');
        Route::post('/requests/{order}/offer', [PharmacyRequestController::class, 'storeOffer'])->name('requests.offer');
        Route::post('/requests/{order}/messages', [MessageController::class, 'store'])->name('requests.messages.store');
        Route::get('/orders', [PharmacyOrderController::class, 'index'])->name('orders.index');
        Route::post('/orders/{order}/complete', [PharmacyOrderController::class, 'complete'])->name('orders.complete');
        Route::inertia('/profile', 'pharmacy/profile')->name('profile');
    });

    // Admin
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', AdminDashboardController::class)->name('dashboard');
        Route::get('/pharmacies', [AdminPharmacyController::class, 'index'])->name('pharmacies.index');
        Route::post('/pharmacies/{pharmacy}/toggle-verified', [AdminPharmacyController::class, 'toggleVerified'])->name('pharmacies.toggle-verified');
        Route::post('/pharmacies/{pharmacy}/toggle-active', [AdminPharmacyController::class, 'toggleActive'])->name('pharmacies.toggle-active');
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/analytics', AdminAnalyticsController::class)->name('analytics');
    });
});

require __DIR__.'/settings.php';
