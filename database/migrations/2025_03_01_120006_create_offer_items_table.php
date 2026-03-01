<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offer_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_item_id')->constrained()->cascadeOnDelete();
            $table->string('medicine_name');
            $table->boolean('is_generic')->default(false);
            $table->boolean('is_substitute')->default(false);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->unsignedInteger('quantity')->default(1);
            $table->boolean('available')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offer_items');
    }
};
