<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('pickup_code', 10)
                ->nullable()
                ->after('total_amount');
            $table->timestamp('pickup_confirmed_at')
                ->nullable()
                ->after('pickup_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['pickup_code', 'pickup_confirmed_at']);
        });
    }
};

