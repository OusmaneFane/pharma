<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pharmacy extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'license_number',
        'address',
        'zone',
        'lat',
        'lng',
        'hours',
        'delivery_zones',
        'is_verified',
        'is_active',
        'avg_response_time',
        'cancellation_rate',
        'rating',
        'total_orders',
    ];

    protected function casts(): array
    {
        return [
            'hours' => 'array',
            'delivery_zones' => 'array',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'lat' => 'decimal:8',
            'lng' => 'decimal:8',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
