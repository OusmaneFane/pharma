<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Services\OrderRoutingService;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderRoutingService $orderRouting
    ) {}

    /**
     * Liste des commandes du client.
     */
    public function index(Request $request): Response
    {
        $client = Auth::user()?->client;
        if (! $client) {
            abort(403);
        }

        $ordersQuery = $client->orders();

        $stats = [
            'total' => (clone $ordersQuery)->count(),
            'in_progress' => (clone $ordersQuery)->whereIn('status', ['pending', 'offers_received', 'accepted', 'preparing', 'ready', 'in_delivery'])->count(),
            'completed' => (clone $ordersQuery)->where('status', 'completed')->count(),
        ];

        $orders = (clone $ordersQuery)
            ->with(['items', 'chosenOffer.pharmacy'])
            ->latest()
            ->paginate(15);

        return Inertia::render('client/orders/index', [
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }

    /**
     * Détail d'une commande (suivi).
     */
    public function show(Order $order): Response|RedirectResponse
    {
        $client = Auth::user()?->client;
        if (! $client || $order->client_id !== $client->id) {
            abort(403);
        }

        $order->load(['items', 'offers.pharmacy', 'chosenOffer.pharmacy', 'payments']);
        $lastPayment = $order->payments()->latest()->first();
        $messages = $order->messages()->with('sender:id,name')->orderBy('id')->get();

        return Inertia::render('client/orders/show', [
            'order' => $order,
            'messages' => $messages,
            'hasPaid' => $order->payments()->where('status', 'completed')->exists(),
            'lastPayment' => $lastPayment?->status === 'completed' ? [
                'method' => $lastPayment->method,
                'transaction_ref' => $lastPayment->transaction_ref,
                'paid_at' => $lastPayment->paid_at?->toIso8601String(),
            ] : null,
        ]);
    }

    /**
     * Affiche le formulaire nouvelle demande.
     */
    public function create(): Response
    {
        return Inertia::render('client/new-order');
    }

    /**
     * Enregistre une nouvelle demande et notifie les pharmacies.
     */
    public function store(Request $request): RedirectResponse
    {
        $client = Auth::user()?->client;
        if (! $client) {
            abort(403);
        }

        $validated = $request->validate([
            'type' => ['required', 'in:prescription,list'],
            'prescription_path' => ['nullable', 'string', 'max:500'],
            'prescription' => ['nullable', 'image', 'max:5120'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'zone' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'accepts_generics' => ['boolean'],
            'accepts_substitution' => ['boolean'],
            'accepts_partial' => ['boolean'],
            'delivery_type' => ['required', 'in:pickup,delivery'],
            'urgency' => ['required', 'in:normal,express'],
            'items' => ['required_if:type,list', 'array'],
            'items.*.medicine_name' => ['required_with:items', 'string', 'max:255'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
            'items.*.dosage' => ['nullable', 'string', 'max:100'],
            'items.*.notes' => ['nullable', 'string', 'max:255'],
        ], [
            'items.required_if' => 'Ajoutez au moins un médicament.',
        ]);

        $prescriptionPath = null;
        if ($request->hasFile('prescription')) {
            $prescriptionPath = $request->file('prescription')->store('prescriptions', 'public');
        }

        $order = Order::create([
            'client_id' => $client->id,
            'type' => $validated['type'],
            'status' => Order::STATUS_PENDING,
            'prescription_path' => $prescriptionPath ?? $validated['prescription_path'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'zone' => $validated['zone'] ?? null,
            'address' => $validated['address'] ?? null,
            'accepts_generics' => $validated['accepts_generics'] ?? true,
            'accepts_substitution' => $validated['accepts_substitution'] ?? false,
            'accepts_partial' => $validated['accepts_partial'] ?? false,
            'delivery_type' => $validated['delivery_type'],
            'urgency' => $validated['urgency'],
            'expires_at' => now()->addHours(24),
        ]);

        if (! empty($validated['items'])) {
            foreach ($validated['items'] as $item) {
                $order->items()->create([
                    'medicine_name' => $item['medicine_name'],
                    'quantity' => (int) $item['quantity'],
                    'dosage' => $item['dosage'] ?? null,
                    'notes' => $item['notes'] ?? null,
                ]);
            }
        }

        $this->orderRouting->notifyPharmacies($order);

        return redirect()
            ->route('client.offers.compare', ['order' => $order->id])
            ->with('success', 'Votre demande a été envoyée aux pharmacies.');
    }
}
