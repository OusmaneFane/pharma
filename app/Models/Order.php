<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'type',
        'status',
        'prescription_path',
        'notes',
        'zone',
        'address',
        'lat',
        'lng',
        'accepts_generics',
        'accepts_substitution',
        'accepts_partial',
        'delivery_type',
        'urgency',
        'chosen_offer_id',
        'total_amount',
        'pickup_code',
        'pickup_confirmed_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'accepts_generics' => 'boolean',
            'accepts_substitution' => 'boolean',
            'accepts_partial' => 'boolean',
            'expires_at' => 'datetime',
            'pickup_confirmed_at' => 'datetime',
        ];
    }

    public const STATUS_PENDING = 'pending';
    public const STATUS_OFFERS_RECEIVED = 'offers_received';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_PREPARING = 'preparing';
    public const STATUS_READY = 'ready';
    public const STATUS_IN_DELIVERY = 'in_delivery';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }

    public function chosenOffer(): BelongsTo
    {
        return $this->belongsTo(Offer::class, 'chosen_offer_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function review(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Review::class);
    }
}
