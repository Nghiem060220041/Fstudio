<?php

use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\Admin\OptionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::apiResource('/properties', PropertyController::class);
    Route::apiResource('/properties/{property}/options', OptionController::class);

    Route::post('/properties/active/{property}', [PropertyController::class, 'active'])->name('properties.active');
    Route::post('/properties/{property}/options/active/{option}', [OptionController::class, 'active'])->name('options.active');
});
