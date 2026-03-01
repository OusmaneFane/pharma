<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        if (! $user || $user->role !== 'admin') {
            abort(403);
        }

        $orders = Order::with(['client.user:id,name,email', 'chosenOffer.pharmacy:id,name'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => Order::count(),
            'pending' => Order::whereIn('status', ['pending', 'offers_received'])->count(),
            'completed' => Order::where('status', 'completed')->count(),
            'revenue' => (int) Payment::where('status', 'completed')->sum('amount'),
        ];

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }
}
