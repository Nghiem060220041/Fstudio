<?php

use App\Http\Controllers\Admin\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::apiResource('/categories', CategoryController::class);

    Route::post('/categories/active/{category}', [CategoryController::class, 'active'])->name('categories.active');
    Route::get('/categories/public-store/get-listmenu', [CategoryController::class, 'getMenuBar'])->name('categories.getMenuBar');
});
