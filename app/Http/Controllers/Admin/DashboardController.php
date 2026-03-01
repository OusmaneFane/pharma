<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = Auth::user();
        if (! $user || $user->role !== 'admin') {
            abort(403);
        }

        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        $totalOrders = Order::count();
        $ordersThisMonth = Order::where('created_at', '>=', $startOfMonth)->count();
        $ordersLastMonth = Order::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $ordersGrowth = $ordersLastMonth > 0
            ? round((($ordersThisMonth - $ordersLastMonth) / $ordersLastMonth) * 100, 1)
            : ($ordersThisMonth > 0 ? 100 : 0);

        $totalPharmacies = Pharmacy::count();
        $verifiedPharmacies = Pharmacy::where('is_verified', true)->where('is_active', true)->count();

        $totalClients = Client::count();

        $revenue = Payment::where('status', 'completed')->sum('amount');
        $revenueThisMonth = Payment::where('status', 'completed')
            ->where('paid_at', '>=', $startOfMonth)
            ->sum('amount');
        $revenueLastMonth = Payment::where('status', 'completed')
            ->whereBetween('paid_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('amount');
        $revenueGrowth = $revenueLastMonth > 0
            ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1)
            : ($revenueThisMonth > 0 ? 100 : 0);

        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $recentOrders = Order::with(['client.user:id,name', 'chosenOffer.pharmacy:id,name'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (Order $o) => [
                'id' => $o->id,
                'status' => $o->status,
                'client_name' => $o->client?->user?->name ?? '—',
                'pharmacy_name' => $o->chosenOffer?->pharmacy?->name ?? '—',
                'total_amount' => $o->total_amount,
                'created_at' => $o->created_at->toIso8601String(),
            ]);

        // Données pour les graphiques : 14 derniers jours
        $days = 14;
        $ordersPerDay = [];
        $revenuePerDay = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            $dayStart = $date->copy()->startOfDay();
            $dayEnd = $date->copy()->endOfDay();
            $ordersPerDay[] = [
                'date' => $dayStart->format('Y-m-d'),
                'label' => $dayStart->format('d/m'),
                'orders' => Order::whereBetween('created_at', [$dayStart, $dayEnd])->count(),
            ];
            $revenuePerDay[] = [
                'date' => $dayStart->format('Y-m-d'),
                'label' => $dayStart->format('d/m'),
                'revenue' => (int) Payment::where('status', 'completed')
                    ->whereBetween('paid_at', [$dayStart, $dayEnd])
                    ->sum('amount'),
            ];
        }

        // Données pour le camembert (statuts)
        $statusLabelsFr = [
            'pending' => 'En attente',
            'offers_received' => 'Offres reçues',
            'accepted' => 'Acceptée',
            'preparing' => 'En préparation',
            'ready' => 'Prêt',
            'in_delivery' => 'En livraison',
            'completed' => 'Terminée',
            'cancelled' => 'Annulée',
        ];
        $chartStatusData = collect($ordersByStatus)->map(fn ($count, $status) => [
            'name' => $statusLabelsFr[$status] ?? $status,
            'value' => (int) $count,
            'status' => $status,
        ])->values()->all();

        return Inertia::render('admin/dashboard', [
            'kpis' => [
                'total_orders' => $totalOrders,
                'orders_this_month' => $ordersThisMonth,
                'orders_growth' => $ordersGrowth,
                'total_pharmacies' => $totalPharmacies,
                'verified_pharmacies' => $verifiedPharmacies,
                'total_clients' => $totalClients,
                'revenue' => $revenue,
                'revenue_this_month' => $revenueThisMonth,
                'revenue_growth' => $revenueGrowth,
            ],
            'orders_by_status' => $ordersByStatus,
            'recent_orders' => $recentOrders,
            'chart_orders_per_day' => $ordersPerDay,
            'chart_revenue_per_day' => $revenuePerDay,
            'chart_status_data' => $chartStatusData,
        ]);
    }
}
