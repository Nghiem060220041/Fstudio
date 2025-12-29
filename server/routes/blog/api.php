<?php

use App\Http\Controllers\Admin\BlogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::apiResource('/blogs', BlogController::class);
    Route::post('/blogs/active/{blog}', [BlogController::class, 'active'])->name('blogs.active');
});
