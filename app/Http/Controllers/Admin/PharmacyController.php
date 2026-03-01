<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PharmacyController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        if (! $user || $user->role !== 'admin') {
            abort(403);
        }

        $pharmacies = Pharmacy::with('user:id,name,email,phone')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/pharmacies/index', [
            'pharmacies' => $pharmacies,
        ]);
    }

    public function toggleVerified(Pharmacy $pharmacy): RedirectResponse
    {
        $user = Auth::user();
        if (! $user || $user->role !== 'admin') {
            abort(403);
        }

        $pharmacy->update(['is_verified' => ! $pharmacy->is_verified]);

        return back()->with('success', $pharmacy->is_verified
            ? "Pharmacie « {$pharmacy->name} » marquée comme vérifiée."
            : "Vérification retirée pour « {$pharmacy->name} ».");
    }

    public function toggleActive(Pharmacy $pharmacy): RedirectResponse
    {
        $user = Auth::user();
        if (! $user || $user->role !== 'admin') {
            abort(403);
        }

        $pharmacy->update(['is_active' => ! $pharmacy->is_active]);

        return back()->with('success', $pharmacy->is_active
            ? "Pharmacie « {$pharmacy->name } » activée."
            : "Pharmacie « {$pharmacy->name} » désactivée (elle ne recevra plus de nouvelles demandes).");
    }
}
