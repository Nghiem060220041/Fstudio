<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skus', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->string('sku')->nullable();
            $table->integer('quantity')->nullable()->default(0);
            $table->integer('sold_quantity')->nullable()->default(0);
            $table->double('price')->nullable()->default(0);
            $table->integer('is_discount')->nullable()->default(0);
            $table->integer('type_discount')->nullable()->default(0);
            $table->double('percent_discount')->nullable()->default(0);
            $table->double('price_discount')->nullable()->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skus');
    }
};
