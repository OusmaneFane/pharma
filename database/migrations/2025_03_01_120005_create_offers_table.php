<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pharmacy_id')->constrained()->cascadeOnDelete();
            $table->string('status', 20)->default('pending'); // pending|accepted|rejected|expired
            $table->decimal('total_price', 12, 2)->default(0);
            $table->string('availability', 20)->default('full'); // full|partial|order
            $table->unsignedInteger('delay_minutes')->nullable();
            $table->string('delivery_type', 20)->default('pickup');
            $table->decimal('delivery_fee', 10, 2)->default(0);
            $table->decimal('service_fee', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->decimal('reliability_score', 5, 2)->nullable();
            $table->decimal('global_score', 5, 2)->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
