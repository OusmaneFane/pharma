<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = Auth::user();
        if (! $user || $user->role !== 'admin') {
            abort(403);
        }

        $now = now();

        // KPIs synthèse
        $totalOrders = Order::count();
        $totalRevenue = (int) Payment::where('status', 'completed')->sum('amount');
        $totalPharmacies = Pharmacy::where('is_active', true)->count();
        $ordersThisMonth = Order::where('created_at', '>=', $now->copy()->startOfMonth())->count();

        // 30 derniers jours — commandes et revenus par jour
        $days = 30;
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

        // 6 derniers mois — commandes par mois
        $months = 6;
        $ordersPerMonth = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();
            $ordersPerMonth[] = [
                'month' => $start->format('Y-m'),
                'label' => $start->format('M Y'),
                'orders' => Order::whereBetween('created_at', [$start, $end])->count(),
                'revenue' => (int) Payment::where('status', 'completed')
                    ->whereBetween('paid_at', [$start, $end])
                    ->sum('amount'),
            ];
        }

        // Répartition par statut
        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
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

        // Top 5 pharmacies par nombre de commandes (offres acceptées)
        $topPharmacies = Order::query()
            ->whereNotNull('chosen_offer_id')
            ->join('offers', 'orders.chosen_offer_id', '=', 'offers.id')
            ->select('offers.pharmacy_id', DB::raw('count(*) as orders_count'), DB::raw('sum(orders.total_amount) as total_revenue'))
            ->groupBy('offers.pharmacy_id')
            ->orderByDesc('orders_count')
            ->limit(5)
            ->get();
        $pharmacyIds = $topPharmacies->pluck('pharmacy_id')->all();
        $pharmacies = Pharmacy::whereIn('id', $pharmacyIds)->get()->keyBy('id');
        $topPharmaciesData = $topPharmacies->map(fn ($row) => [
            'pharmacy_name' => $pharmacies->get($row->pharmacy_id)?->name ?? '—',
            'orders_count' => (int) $row->orders_count,
            'total_revenue' => (int) ($row->total_revenue ?? 0),
        ])->all();

        return Inertia::render('admin/analytics', [
            'kpis' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'total_pharmacies' => $totalPharmacies,
                'orders_this_month' => $ordersThisMonth,
            ],
            'chart_orders_per_day' => $ordersPerDay,
            'chart_revenue_per_day' => $revenuePerDay,
            'chart_orders_per_month' => $ordersPerMonth,
            'chart_status_data' => $chartStatusData,
            'top_pharmacies' => $topPharmaciesData,
        ]);
    }
}
