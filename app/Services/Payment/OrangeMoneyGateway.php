<?php

namespace App\Services\Payment;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Str;

class OrangeMoneyGateway implements PaymentGatewayInterface
{
    public function initiatePayment(Order $order, string $phone): array
    {
        $ref = 'OM-'.Str::upper(Str::random(8));
        return [
            'transaction_ref' => $ref,
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
        if ($payment->status !== 'completed') {
            return false;
        }
        $payment->update(['status' => 'refunded']);
        return true;
    }
}
