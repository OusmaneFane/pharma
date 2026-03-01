<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\PaymentGatewayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentGatewayService $paymentGateway
    ) {}

    /**
     * Affiche le formulaire de paiement pour une commande.
     */
    public function show(Order $order): Response|RedirectResponse
    {
        $client = Auth::user()?->client;
        if (! $client || $order->client_id !== $client->id) {
            abort(403);
        }

        if ($order->status !== 'accepted' || ! $order->chosen_offer_id) {
            return redirect()
                ->route('client.orders.show', ['order' => $order])
                ->with('error', 'Cette commande n\'est pas encore prête pour le paiement.');
        }

        $amount = $order->total_amount ?? $order->chosenOffer?->total_price ?? 0;
        $existingPaid = $order->payments()->where('status', 'completed')->exists();
        if ($existingPaid) {
            return redirect()
                ->route('client.orders.show', ['order' => $order])
                ->with('info', 'Cette commande est déjà payée.');
        }

        $order->load('chosenOffer');

        return Inertia::render('client/orders/pay', [
            'order' => $order,
            'amount' => (float) $amount,
            'methods' => [
                ['id' => 'orange_money', 'label' => 'Orange Money', 'phone_required' => true],
                ['id' => 'moov_money', 'label' => 'Moov Money', 'phone_required' => true],
                ['id' => 'cash', 'label' => 'Paiement à la livraison / retrait', 'phone_required' => false],
            ],
        ]);
    }

    /**
     * Initie le paiement (Mobile Money) ou enregistre "à payer à la livraison" (cash).
     */
    public function store(Request $request, Order $order): RedirectResponse
    {
        $client = Auth::user()?->client;
        if (! $client || $order->client_id !== $client->id) {
            abort(403);
        }

        if ($order->status !== 'accepted' || ! $order->chosen_offer_id) {
            return back()->withErrors(['order' => 'Commande invalide.']);
        }

        $amount = (float) ($order->total_amount ?? $order->chosenOffer?->total_price ?? 0);
        $validated = $request->validate([
            'method' => ['required', 'string', 'in:orange_money,moov_money,cash'],
            'phone' => ['required_if:method,orange_money,moov_money', 'nullable', 'string', 'max:20'],
        ]);

        $existingPaid = $order->payments()->where('status', 'completed')->exists();
        if ($existingPaid) {
            return redirect()
                ->route('client.orders.show', ['order' => $order])
                ->with('info', 'Cette commande est déjà payée.');
        }

        $gateway = $this->paymentGateway->gateway($validated['method']);
        $phone = $validated['phone'] ?? '';

        $intent = $gateway->initiatePayment($order, $phone);
        $payment = $order->payments()->create([
            'method' => $validated['method'],
            'status' => $intent['status'],
            'amount' => $amount,
            'transaction_ref' => $intent['transaction_ref'],
        ]);

        if ($validated['method'] === 'cash') {
            $gateway->confirmPayment($payment);
            return redirect()
                ->route('client.orders.show', ['order' => $order])
                ->with('success', 'Paiement à la livraison/retrait enregistré.');
        }

        $gateway->confirmPayment($payment);
        return redirect()
            ->route('client.orders.show', ['order' => $order])
            ->with('success', 'Paiement effectué. Référence : '.$payment->transaction_ref);
    }
}
