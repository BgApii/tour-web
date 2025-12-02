<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaketTour;

class PaketTourController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->check() && in_array(auth()->user()->role, ['admin', 'owner'], true) && ! $request->expectsJson()) {
            return redirect(auth()->user()->role === 'owner' ? '/owner/rekapitulasi' : '/admin/paket');
        }

        // hanya tampilkan paket aktif
        $paket = PaketTour::where('tampil_di_katalog', true)->get();

        if ($request->expectsJson()) {
            return response()->json(['data' => $paket]);
        }

        return view('app');
    }

    public function show(Request $request, PaketTour $paketTour)
    {
        if (auth()->check() && in_array(auth()->user()->role, ['admin', 'owner'], true) && ! $request->expectsJson()) {
            return redirect(auth()->user()->role === 'owner' ? '/owner/rekapitulasi' : '/admin/paket');
        }

        $paketTour->load('ratings');

        if ($request->expectsJson()) {
            return response()->json(['data' => $paketTour]);
        }

        return view('app');
    }
}
