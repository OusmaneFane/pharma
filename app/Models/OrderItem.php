<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'medicine_name',
        'quantity',
        'dosage',
        'notes',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function offerItems(): HasMany
    {
        return $this->hasMany(OfferItem::class, 'order_item_id');
    }
}
