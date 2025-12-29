<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('code')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->double('total')->nullable()->default(null);
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('sku_id')->nullable();
            $table->integer('quantity')->nullable()->default(0);
            $table->double('price')->nullable()->default(null);
            $table->integer('status')->nullable()->default(0);
            $table->text('address')->nullable();
            $table->text('description')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
        });
    }
};
