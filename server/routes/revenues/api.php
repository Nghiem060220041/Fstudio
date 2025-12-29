<?php

use App\Http\Controllers\Admin\RevenueController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::get('/revenues/total-revenue', [RevenueController::class, 'totalRevenue'])->name('revenues.totalRevenue');
    Route::get('/revenues/total-customer', [RevenueController::class, 'totalCustomer'])->name('revenues.totalCustomer');
    Route::get('/revenues/total-product', [RevenueController::class, 'totalProduct'])->name('revenues.totalProduct');
    Route::get('/revenues/total-order', [RevenueController::class, 'totalOrder'])->name('revenues.totalOrder');
    Route::get('/revenues/total-revenue-follow-month', [RevenueController::class, 'totalRevenueMonth'])->name('revenues.totalRevenueMonth');
    Route::get('/revenues/top-sale-product-follow-month', [RevenueController::class, 'topSaleProductMonth'])->name('revenues.topSaleProductMonth');
    Route::get('/revenues/select-order-by-status', [RevenueController::class, 'selectOrderByStatus'])->name('revenues.selectOrderByStatus');
    Route::get('/revenues/select-revenue-by-payment-type', [RevenueController::class, 'selectRevenuesByPaymentType'])->name('revenues.selectRevenuesByPaymentType');
    Route::get('/revenues/select-order-recent', [RevenueController::class, 'selectOrderRecent'])->name('revenues.selectOrderRecent');
    Route::get('/revenues/index', [RevenueController::class, 'index'])->name('revenues.index');
    Route::get('/revenues/export', [RevenueController::class, 'export'])->name('revenues.export');
});
