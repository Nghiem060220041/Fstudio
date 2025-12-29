<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->nullable();
            $table->string('name')->nullable();
            $table->integer('many_version')->nullable()->default(0);
            $table->integer('quantity')->nullable()->default(0);
            $table->integer('sold_quantity')->nullable()->default(0);
            $table->double('price')->nullable();
            $table->integer('is_discount')->nullable()->default(0);
            $table->integer('type_discount')->nullable()->default(0);
            $table->double('percent_discount')->nullable()->default(0);
            $table->double('price_discount')->nullable()->default(0);
            $table->unsignedBigInteger('brand_id')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('slug')->nullable();
            $table->text('description')->nullable();
            $table->integer('active')->nullable()->default(0);
            $table->integer('trending')->nullable()->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
