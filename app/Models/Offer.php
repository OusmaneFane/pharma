<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'pharmacy_id',
        'status',
        'total_price',
        'availability',
        'delay_minutes',
        'delivery_type',
        'delivery_fee',
        'service_fee',
        'notes',
        'reliability_score',
        'global_score',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_EXPIRED = 'expired';

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function pharmacy(): BelongsTo
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OfferItem::class);
    }
}
