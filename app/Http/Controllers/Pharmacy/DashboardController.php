<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = Auth::user();
        $pharmacy = $user?->pharmacy;
        if (! $pharmacy) {
            abort(403);
        }

        $pharmacyId = $pharmacy->id;

        // Demandes en attente (sans offre de cette pharmacie ou offre pending)
        $pendingRequests = Order::query()
            ->whereIn('status', ['pending', 'offers_received'])
            ->where(function ($q) use ($pharmacyId) {
                $q->whereDoesntHave('offers', fn ($q2) => $q2->where('pharmacy_id', $pharmacyId))
                    ->orWhereHas('offers', fn ($q2) => $q2->where('pharmacy_id', $pharmacyId)->where('status', 'pending'));
            })
            ->count();

        // Commandes gagnées (où cette pharmacie a été choisie)
        $myOrdersQuery = Order::query()
            ->with(['client.user:id,name', 'items'])
            ->whereHas('chosenOffer', fn ($q) => $q->where('pharmacy_id', $pharmacyId));

        $totalOrders = (clone $myOrdersQuery)->count();
        $activeOrders = (clone $myOrdersQuery)
            ->whereIn('status', ['accepted', 'preparing', 'ready', 'in_delivery'])
            ->count();
        $completedOrders = (clone $myOrdersQuery)->where('status', 'completed')->count();

        $recentOrders = Order::query()
            ->with(['client.user:id,name'])
            ->whereHas('chosenOffer', fn ($q) => $q->where('pharmacy_id', $pharmacyId))
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Order $o) => [
                'id' => $o->id,
                'status' => $o->status,
                'client_name' => $o->client?->user?->name ?? '—',
                'total_amount' => $o->total_amount,
                'created_at' => $o->created_at->toIso8601String(),
            ]);

        return Inertia::render('pharmacy/dashboard', [
            'kpis' => [
                'pending_requests' => $pendingRequests,
                'total_orders' => $totalOrders,
                'active_orders' => $activeOrders,
                'completed_orders' => $completedOrders,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }
}
