<?php

use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\Client\AuthController as ClientAuthController;
use Illuminate\Support\Facades\Route;

require __DIR__ . "/banner/api.php";
require __DIR__ . "/blog/api.php";
require __DIR__ . "/brand/api.php";
require __DIR__ . "/category/api.php";
require __DIR__ . "/coupon/api.php";
require __DIR__ . "/customer/api.php";
require __DIR__ . "/order/api.php";
require __DIR__ . "/product/api.php";
require __DIR__ . "/property/api.php";
require __DIR__ . "/revenues/api.php";
require __DIR__ . "/role/api.php";
require __DIR__ . "/user/api.php";

#--Auth
Route::controller(AuthController::class)
    ->prefix('/auth')
    ->name('auth.')
    ->group(function () {
        Route::post('/login', 'login')->name('login');
        Route::post('/refresh', 'refresh')->name('refresh');
        Route::post('/logout', 'logout')->name('logout');
        Route::post('/register', 'register')->name('register');
        Route::get('/reset-password', 'getReset')->name('getReset');
        Route::post('/reset-password', 'postReset')->name('postReset');
    });

#--Auth-StoreFront
Route::controller(ClientAuthController::class)
    ->name('customers.')
    ->group(function () {
        Route::post('/login', 'login')->name('login');
        Route::post('/refresh', 'refresh')->name('refresh');
        Route::post('/logout', 'logout')->name('logout');
        Route::post('/register', 'register')->name('register');
        Route::get('/reset-password', 'getReset')->name('getReset');
        Route::post('/reset-password', 'postReset')->name('postReset');
    });

#--NoAuth
Route::controller(BannerController::class)
    ->prefix('/banners')
    ->name('banners.')
    ->group(function () {
        Route::get('/get-all/store', 'getAllFront')->name('getAllFront');
    });

Route::controller(HomeController::class)
    ->prefix('/homes')
    ->name('homes.')
    ->group(function () {
        Route::get('/get-provinces', 'getProvinces')->name('getProvinces');
        Route::get('/get-districts/{provinceId}', 'getDistricts')->name('getDistricts');
        Route::get('/get-wards/{districtId}', 'getWards')->name('getWards');
        Route::get('/get-roles', 'getRoles')->name('getRoles');
    });
