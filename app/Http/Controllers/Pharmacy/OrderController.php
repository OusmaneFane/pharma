<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Liste des commandes où cette pharmacie a été choisie.
     */
    public function index(Request $request): Response
    {
        $pharmacy = Auth::user()?->pharmacy;
        if (! $pharmacy) {
            abort(403);
        }

        $orders = Order::query()
            ->with(['client.user:id,name', 'items'])
            ->whereHas('chosenOffer', fn ($q) => $q->where('pharmacy_id', $pharmacy->id))
            ->latest()
            ->paginate(15);

        $stats = [
            'total' => Order::query()
                ->whereHas('chosenOffer', fn ($q) => $q->where('pharmacy_id', $pharmacy->id))
                ->count(),
            'active' => Order::query()
                ->whereHas('chosenOffer', fn ($q) => $q->where('pharmacy_id', $pharmacy->id))
                ->whereIn('status', ['accepted', 'preparing', 'ready', 'in_delivery'])
                ->count(),
            'completed' => Order::query()
                ->whereHas('chosenOffer', fn ($q) => $q->where('pharmacy_id', $pharmacy->id))
                ->where('status', 'completed')
                ->count(),
        ];

        return Inertia::render('pharmacy/orders/index', [
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }
}
