<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        $user = $request->user();
        $intended = $request->session()->pull('url.intended');

        if ($intended && str_starts_with(parse_url($intended, PHP_URL_PATH) ?? '', '/client')) {
            return redirect()->to($intended);
        }
        if ($intended && str_starts_with(parse_url($intended, PHP_URL_PATH) ?? '', '/pharmacy')) {
            return redirect()->to($intended);
        }
        if ($intended && str_starts_with(parse_url($intended, PHP_URL_PATH) ?? '', '/admin')) {
            return redirect()->to($intended);
        }

        return match ($user?->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'pharmacy' => redirect()->route('pharmacy.dashboard'),
            'client' => redirect()->route('client.dashboard'),
            default => redirect()->route('dashboard'),
        };
    }
}
