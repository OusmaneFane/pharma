<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Vérifie que l'utilisateur (client ou pharmacie choisie) peut accéder à cette commande.
     */
    private function canAccessOrder(Order $order): bool
    {
        $user = Auth::user();
        if (! $user) {
            return false;
        }
        if ($user->isClient() && $user->client && $order->client_id === $user->client->id) {
            return true;
        }
        if ($user->isPharmacy() && $user->pharmacy && $order->chosen_offer_id) {
            $order->load('chosenOffer');
            if ($order->chosenOffer && (int) $order->chosenOffer->pharmacy_id === (int) $user->pharmacy->id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Envoyer un message sur une commande.
     */
    public function store(Request $request, Order $order): RedirectResponse
    {
        if (! $this->canAccessOrder($order)) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
            'type' => ['nullable', 'string', 'in:logistics,advice'],
        ]);

        $order->messages()->create([
            'sender_id' => Auth::id(),
            'type' => $validated['type'] ?? 'logistics',
            'content' => $validated['content'],
        ]);

        return back();
    }
}
