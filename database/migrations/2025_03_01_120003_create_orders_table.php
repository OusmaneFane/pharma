<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20)->default('list'); // prescription|list
            $table->string('status', 30)->default('pending');
            // pending|offers_received|accepted|preparing|ready|in_delivery|completed|cancelled
            $table->string('prescription_path')->nullable();
            $table->text('notes')->nullable();
            $table->string('zone', 100)->nullable();
            $table->string('address')->nullable();
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->boolean('accepts_generics')->default(true);
            $table->boolean('accepts_substitution')->default(false);
            $table->boolean('accepts_partial')->default(false);
            $table->string('delivery_type', 20)->default('pickup'); // pickup|delivery
            $table->string('urgency', 20)->default('normal'); // normal|express
            $table->decimal('total_amount', 12, 2)->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
