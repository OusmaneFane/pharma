<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Pharmacy;

class OrderRoutingService
{
    /**
     * Sélectionne les pharmacies à notifier selon zone, horaires, fiabilité.
     * Notifie max 10–15 pharmacies (broadcast à implémenter avec Laravel Echo).
     */
    public function notifyPharmacies(Order $order): void
    {
        $pharmacies = $this->getEligiblePharmacies($order);

        foreach ($pharmacies as $pharmacy) {
            // TODO: broadcast NewOrderReceived event
            // broadcast(new NewOrderReceived($order, $pharmacy));
        }
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Pharmacy>
     */
    private function getEligiblePharmacies(Order $order)
    {
        return Pharmacy::query()
            ->where('is_active', true)
            ->when($order->zone, fn ($q) => $q->where('zone', $order->zone))
            ->orderByDesc('rating')
            ->limit(15)
            ->get();
    }
}
