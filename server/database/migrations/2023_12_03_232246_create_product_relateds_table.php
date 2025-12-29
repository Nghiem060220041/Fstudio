<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_relateds', function (Blueprint $table) {
            $table->unsignedBigInteger('parent_product_id')->nullable();
            $table->unsignedBigInteger('child_product_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_relateds');
    }
};
