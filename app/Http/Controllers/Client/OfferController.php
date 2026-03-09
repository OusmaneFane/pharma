<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OfferScoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OfferController extends Controller
{
    public function __construct(
        private OfferScoringService $scoring
    ) {}

    /**
     * Page comparateur d'offres pour une commande.
     */
    public function compare(Request $request, Order $order): Response|RedirectResponse
    {
        $client = Auth::user()?->client;
        if (! $client || $order->client_id !== $client->id) {
            abort(403);
        }

        $order->load(['items', 'offers.pharmacy.user', 'offers.items']);
        $offers = $order->offers->where('status', 'pending');

        $offers = $this->scoring->scoreAndRank($order, $offers);

        return Inertia::render('client/offers/compare', [
            'order' => $order,
            'offers' => $offers->values()->all(),
        ]);
    }

    /**
     * Choisir une offre (accepter).
     */
    public function chooseOffer(Request $request, Order $order): RedirectResponse
    {
        $client = Auth::user()?->client;
        if (! $client || $order->client_id !== $client->id) {
            abort(403);
        }

        $validated = $request->validate([
            'offer_id' => ['required', 'integer', 'exists:offers,id'],
        ]);

        $offer = $order->offers()->findOrFail($validated['offer_id']);
        if ($offer->status !== 'pending') {
            return back()->withErrors(['offer_id' => 'Cette offre n\'est plus disponible.']);
        }

        $order->offers()->where('id', '!=', $offer->id)->update(['status' => 'rejected']);
        $offer->update(['status' => 'accepted']);
        $order->update([
            'chosen_offer_id' => $offer->id,
            'total_amount' => $offer->total_price + $offer->delivery_fee + $offer->service_fee,
            'status' => Order::STATUS_ACCEPTED,
            'pickup_code' => $order->pickup_code ?: (string) random_int(100000, 999999),
        ]);

        return redirect()
            ->route('client.orders.show', ['order' => $order])
            ->with('success', 'Offre acceptée. Vous pouvez suivre votre commande.');
    }
}
