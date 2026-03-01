<?php

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\Services\Payment\CashGateway;
use App\Services\Payment\MoovMoneyGateway;
use App\Services\Payment\OrangeMoneyGateway;
use Illuminate\Support\Facades\App;

class PaymentGatewayService
{
    private const GATEWAYS = [
        'orange_money' => OrangeMoneyGateway::class,
        'moov_money' => MoovMoneyGateway::class,
        'cash' => CashGateway::class,
    ];

    public function gateway(string $method): PaymentGatewayInterface
    {
        $class = self::GATEWAYS[$method] ?? CashGateway::class;
        return App::make($class);
    }

    public function supportedMethods(): array
    {
        return array_keys(self::GATEWAYS);
    }
}
