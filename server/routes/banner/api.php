<?php

use App\Http\Controllers\Admin\BannerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::apiResource('/banners', BannerController::class);
    Route::post('/banners/active/{banner}', [BannerController::class, 'active'])->name('banners.active');
});
