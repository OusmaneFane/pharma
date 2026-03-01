<?php

namespace App\Services\Payment;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use App\Models\Payment;

class CashGateway implements PaymentGatewayInterface
{
    public function initiatePayment(Order $order, string $phone): array
    {
        return [
            'transaction_ref' => 'CASH-'.$order->id,
            'status' => 'pending',
        ];
    }

    public function confirmPayment(Payment $payment): bool
    {
        if ($payment->status !== 'pending') {
            return false;
        }
        $payment->update([
            'status' => 'completed',
            'paid_at' => now(),
        ]);
        return true;
    }

    public function refund(Payment $payment): bool
    {
        $payment->update(['status' => 'refunded']);
        return true;
    }
}
