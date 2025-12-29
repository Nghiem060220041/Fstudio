<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        //['name', 'code', 'type', 'value', 'count', 'expired_at', 'active', 'description'];
        Schema::table('coupons', function (Blueprint $table) {
            $table->renameColumn('count', 'quantity');
            $table->integer('quantity_used')->nullable()->default(0);
            $table->integer('value_max')->nullable()->default(0);
            $table->integer('new_customer')->nullable()->default(0);
            $table->integer('has_expired')->nullable()->default(1);
        });
    }

    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
        });
    }
};
