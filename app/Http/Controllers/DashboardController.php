<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Redirect to role-based dashboard or show generic dashboard.
     */
    public function __invoke(): RedirectResponse|Response
    {
        $user = Auth::user();

        return match ($user?->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'pharmacy' => redirect()->route('pharmacy.dashboard'),
            'client' => redirect()->route('client.dashboard'),
            default => Inertia::render('dashboard'),
        };
    }
}
