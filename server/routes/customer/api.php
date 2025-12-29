<?php

use App\Http\Controllers\Admin\CustomerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::apiResource('/customers', CustomerController::class);

    Route::post('/customers/active/{customer}', [CustomerController::class, 'active'])->name('customers.active');
    Route::put('/customers/update/{customer}/FE', [CustomerController::class, 'updateFE'])->name('customers.updateFE');
    Route::patch('/customers/update/{customer}/password', [CustomerController::class, 'updatePassword'])->name('customers.updatePassword');
    Route::delete('/customers/update/{customer}/delete', [CustomerController::class, 'deleteFE'])->name('customers.deleteFE');
});
