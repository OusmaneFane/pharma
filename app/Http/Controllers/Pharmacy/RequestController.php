<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Order;
use App\Services\OfferScoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RequestController extends Controller
{
    public function __construct(
        private OfferScoringService $scoring
    ) {}

    /**
     * Liste des demandes reçues (orders sans offre de cette pharmacie ou avec offre pending).
     */
    public function index(Request $request): Response
    {
        $pharmacy = Auth::user()?->pharmacy;
        if (! $pharmacy) {
            abort(403);
        }

        $baseQuery = Order::query()
            ->whereIn('status', ['pending', 'offers_received'])
            ->where(function ($q) use ($pharmacy) {
                $q->whereDoesntHave('offers', fn ($q2) => $q2->where('pharmacy_id', $pharmacy->id))
                    ->orWhereHas('offers', fn ($q2) => $q2->where('pharmacy_id', $pharmacy->id)->where('status', 'pending'));
            });

        $stats = [
            'total' => (clone $baseQuery)->count(),
            'prescription' => (clone $baseQuery)->where('type', 'prescription')->count(),
            'list' => (clone $baseQuery)->where('type', 'list')->count(),
        ];

        $requests = (clone $baseQuery)
            ->with(['items', 'client.user'])
            ->latest()
            ->paginate(10);

        return Inertia::render('pharmacy/requests/index', [
            'requests' => $requests,
            'stats' => $stats,
        ]);
    }

    /**
     * Détail d'une demande + formulaire pour envoyer une offre.
     */
    public function show(Order $order): Response
    {
        $pharmacy = Auth::user()?->pharmacy;
        if (! $pharmacy) {
            abort(403);
        }

        $order->load(['items', 'chosenOffer']);
        $myOffer = $order->offers()->where('pharmacy_id', $pharmacy->id)->with('items')->first();
        $canChat = $order->chosen_offer_id && $order->chosenOffer && (int) $order->chosenOffer->pharmacy_id === (int) $pharmacy->id;
        $messages = $canChat ? $order->messages()->with('sender:id,name')->orderBy('id')->get() : [];

        return Inertia::render('pharmacy/requests/show', [
            'order' => $order,
            'myOffer' => $myOffer,
            'messages' => $messages,
            'canChat' => $canChat,
        ]);
    }

    /**
     * Envoyer ou mettre à jour une offre.
     */
    public function storeOffer(Request $request, Order $order): RedirectResponse
    {
        $pharmacy = Auth::user()?->pharmacy;
        if (! $pharmacy) {
            abort(403);
        }

        if (! in_array($order->status, ['pending', 'offers_received'], true)) {
            return back()->withErrors(['order' => 'Cette demande n\'accepte plus d\'offres.']);
        }

        $validated = $request->validate([
            'total_price' => ['required', 'numeric', 'min:0'],
            'availability' => ['required', 'in:full,partial,order'],
            'delay_minutes' => ['required', 'integer', 'min:0'],
            'delivery_type' => ['required', 'in:pickup,delivery'],
            'delivery_fee' => ['nullable', 'numeric', 'min:0'],
            'service_fee' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array'],
            'items.*.order_item_id' => ['required', 'integer', 'exists:order_items,id'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.available' => ['boolean'],
        ]);

        $offer = $order->offers()->firstOrNew(['pharmacy_id' => $pharmacy->id]);
        $offer->fill([
            'status' => Offer::STATUS_PENDING,
            'total_price' => $validated['total_price'],
            'availability' => $validated['availability'],
            'delay_minutes' => $validated['delay_minutes'],
            'delivery_type' => $validated['delivery_type'],
            'delivery_fee' => $validated['delivery_fee'] ?? 0,
            'service_fee' => $validated['service_fee'] ?? 0,
            'notes' => $validated['notes'] ?? null,
            'expires_at' => now()->addHours(24),
        ]);
        $offer->save();

        $offer->items()->delete();
        $orderItemIds = $order->items()->pluck('id')->all();
        foreach ($validated['items'] as $item) {
            if (! in_array((int) $item['order_item_id'], $orderItemIds, true)) {
                continue;
            }
            $orderItem = \App\Models\OrderItem::find($item['order_item_id']);
            $offer->items()->create([
                'order_item_id' => $item['order_item_id'],
                'medicine_name' => $orderItem->medicine_name,
                'unit_price' => $item['unit_price'],
                'quantity' => $item['quantity'],
                'available' => $item['available'] ?? true,
            ]);
        }

        $this->scoring->scoreAndRank($order, $order->offers()->where('status', 'pending')->get());

        if ($order->status === 'pending') {
            $order->update(['status' => 'offers_received']);
        }

        return redirect()
            ->route('pharmacy.requests.index')
            ->with('success', 'Votre offre a été envoyée.');
    }
}
