<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_option_sku', function (Blueprint $table) {
            $table->unsignedBigInteger('sku_id');
            $table->unsignedBigInteger('property_option_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_option_sku');
    }
};
