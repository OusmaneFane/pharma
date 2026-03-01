<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pharmacies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('license_number')->nullable();
            $table->string('address')->nullable();
            $table->string('zone', 100)->nullable();
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->json('hours')->nullable();
            $table->json('delivery_zones')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('avg_response_time')->nullable()->comment('minutes');
            $table->decimal('cancellation_rate', 5, 2)->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('total_orders')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacies');
    }
};
