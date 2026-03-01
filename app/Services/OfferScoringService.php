<?php

namespace App\Services;

use App\Models\Offer;
use App\Models\Order;
use Illuminate\Support\Collection;

class OfferScoringService
{
    /** Poids: Disponibilité 30%, Prix 25%, Délai 20%, Fiabilité 15%, Livraison 10% */
    private const WEIGHT_AVAILABILITY = 0.30;
    private const WEIGHT_PRICE = 0.25;
    private const WEIGHT_DELAY = 0.20;
    private const WEIGHT_RELIABILITY = 0.15;
    private const WEIGHT_DELIVERY = 0.10;

    /**
     * Calcule le score global d'une offre et met à jour global_score + reliability_score.
     *
     * @param  Collection<int, Offer>  $offers
     * @return Collection<int, Offer>
     */
    public function scoreAndRank(Order $order, Collection $offers): Collection
    {
        if ($offers->isEmpty()) {
            return $offers;
        }

        $minPrice = $offers->min('total_price') ?: 1;
        $minDelay = $offers->min('delay_minutes') ?: 1;

        foreach ($offers as $offer) {
            $offer->reliability_score = $this->reliabilityScore($offer);
            $offer->global_score = $this->globalScore($order, $offer, $minPrice, $minDelay);
            $offer->saveQuietly();
        }

        return $offers->sortByDesc('global_score')->values();
    }

    private function availabilityScore(Offer $offer): float
    {
        return match ($offer->availability) {
            'full' => 100,
            'partial' => 60,
            'order' => 30,
            default => 50,
        };
    }

    private function priceScore(Offer $offer, float $minPrice): float
    {
        if ($offer->total_price <= 0) {
            return 100;
        }
        $ratio = $minPrice / $offer->total_price;

        return min(100, $ratio * 100);
    }

    private function delayScore(Offer $offer, float $minDelay): float
    {
        $delay = $offer->delay_minutes ?? 60;
        if ($delay <= 0) {
            return 100;
        }
        $ratio = $minDelay / $delay;

        return min(100, $ratio * 100);
    }

    private function reliabilityScore(Offer $offer): float
    {
        $pharmacy = $offer->pharmacy;
        $rating = $pharmacy?->rating ?? 0;
        $totalOrders = $pharmacy?->total_orders ?? 0;
        $cancellation = $pharmacy?->cancellation_rate ?? 0;

        $score = ($rating / 5) * 50;
        $score += min(30, $totalOrders / 10);
        $score -= $cancellation;

        return max(0, min(100, round($score, 2)));
    }

    private function deliveryScore(Offer $offer, Order $order): float
    {
        if ($order->delivery_type === 'pickup' && $offer->delivery_type === 'pickup') {
            return 100;
        }
        if ($order->delivery_type === 'delivery' && $offer->delivery_type === 'delivery') {
            return 100;
        }
        if ($order->delivery_type === 'delivery' && $offer->delivery_type === 'pickup') {
            return 40;
        }

        return 70;
    }

    private function globalScore(Order $order, Offer $offer, float $minPrice, float $minDelay): float
    {
        $av = $this->availabilityScore($offer);
        $pr = $this->priceScore($offer, $minPrice);
        $de = $this->delayScore($offer, $minDelay);
        $re = $offer->reliability_score ?? $this->reliabilityScore($offer);
        $dv = $this->deliveryScore($offer, $order);

        $score = $av * self::WEIGHT_AVAILABILITY
            + $pr * self::WEIGHT_PRICE
            + $de * self::WEIGHT_DELAY
            + $re * self::WEIGHT_RELIABILITY
            + $dv * self::WEIGHT_DELIVERY;

        return round($score, 2);
    }
}
