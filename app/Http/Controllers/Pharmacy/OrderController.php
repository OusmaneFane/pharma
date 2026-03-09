<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
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

    /**
     * Marquer une commande comme retirée par le client (code de retrait obligatoire).
     */
    public function complete(Request $request, Order $order): RedirectResponse
    {
        $pharmacy = Auth::user()?->pharmacy;
        if (! $pharmacy) {
            abort(403);
        }

        if (! $order->chosenOffer || (int) $order->chosenOffer->pharmacy_id !== (int) $pharmacy->id) {
            abort(403);
        }

        $data = $request->validate([
            'pickup_code' => ['required', 'string'],
        ]);

        if (! $order->pickup_code || ! hash_equals((string) $order->pickup_code, trim($data['pickup_code']))) {
            return back()->withErrors(['pickup_code' => 'Code de retrait incorrect.']);
        }

        if ($order->status !== Order::STATUS_COMPLETED) {
            $order->update([
                'status' => Order::STATUS_COMPLETED,
                'pickup_confirmed_at' => now(),
            ]);
        }

        return back()->with('success', 'Commande marquée comme retirée.');
    }
}
