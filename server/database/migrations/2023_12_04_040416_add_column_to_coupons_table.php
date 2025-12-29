<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->integer('active')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            
        });
    }
};
