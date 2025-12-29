<?php

use App\Http\Controllers\Admin\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::apiResource('/orders', OrderController::class);

    Route::post('/orders/status-order/{code}', [OrderController::class, 'status'])->name('orders.status');
    Route::get('/orders/search-order/{code}', [OrderController::class, 'searchOrder'])->name('orders.searchOrder');
    Route::get('/orders/index/{customer}', [OrderController::class, 'index2'])->name('orders.index2');
    Route::get('/orders/vnpay/{code}', [OrderController::class, 'vnpay2'])->name('orders.vnpay2');
    Route::get('/orders/vnpay/v2/vnpay-ipn', [OrderController::class, 'vnpayIpn'])->name('orders.vnpayIpn');
    Route::get('/orders/status-order/cancelled/{code}', [OrderController::class, 'cancelled'])->name('orders.cancelled');
    Route::get('/orders/status-payment/check-coupon/{customer}/{coupon}', [OrderController::class, 'checkCoupon'])->name('orders.checkCoupon');
    Route::post('/orders/status-payment/{code}', [OrderController::class, 'payment'])->name('orders.payment');
});
