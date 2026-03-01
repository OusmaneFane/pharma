<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfferItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_id',
        'order_item_id',
        'medicine_name',
        'is_generic',
        'is_substitute',
        'unit_price',
        'quantity',
        'available',
    ];

    protected function casts(): array
    {
        return [
            'is_generic' => 'boolean',
            'is_substitute' => 'boolean',
            'available' => 'boolean',
        ];
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class, 'order_item_id');
    }
}
