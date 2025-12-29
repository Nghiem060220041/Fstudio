<?php

use App\Http\Controllers\Admin\CouponController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::apiResource('/coupons', CouponController::class);

    Route::post('/coupons/active/{coupon}', [CouponController::class, 'active'])->name('coupons.active');
    Route::get('/coupons/public-store/get-all-coupon', [CouponController::class, 'getAllCoupons'])->name('coupons.getAllCoupons');
});
