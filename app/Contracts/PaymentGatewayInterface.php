<?php

namespace App\Contracts;

use App\Models\Order;
use App\Models\Payment;

interface PaymentGatewayInterface
{
    /**
     * Initie un paiement et retourne l'intent (ref à confirmer côté client).
     *
     * @return array{transaction_ref: string, status: string}
     */
    public function initiatePayment(Order $order, string $phone): array;

    /**
     * Confirme un paiement après validation (OTP simulé ou callback).
     */
    public function confirmPayment(Payment $payment): bool;

    /**
     * Rembourse un paiement.
     */
    public function refund(Payment $payment): bool;
}
