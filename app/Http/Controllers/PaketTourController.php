<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaketTour;
use App\Models\Rating;

/**
 * Controller untuk katalog paket tour publik.
 */
class PaketTourController extends Controller
{
    /**
     * Mengambil data paket tour aktif.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function ambilDataPaket(Request $request)
    {
        if (auth()->check() && in_array(auth()->user()->role, ['admin', 'owner'], true) && ! $request->expectsJson()) {
            return redirect(auth()->user()->role === 'owner' ? '/owner/rekapitulasi' : '/admin/paket');
        }

        // hanya tampilkan paket aktif
        $paket = PaketTour::where('tampil_di_katalog', true)->get();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Data paket',
                'data' => $paket,
            ]);
        }

        return view('app');
    }

    /**
     * Mengambil daftar rating terbaru untuk ditampilkan di katalog.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function ratings()
    {
        $ratings = Rating::with([
            'paketTour:id,nama_paket,banner',
            'user:id,name',
        ])
            ->orderByDesc('created_at')
            ->take(12)
            ->get()
            ->map(function ($rating) {
                return [
                    'id' => $rating->id,
                    'nilai_rating' => $rating->nilai_rating,
                    'ulasan' => $rating->ulasan,
                    'paket' => [
                        'id' => $rating->paketTour?->id,
                        'nama_paket' => $rating->paketTour?->nama_paket,
                        'banner_url' => $rating->paketTour?->banner_url,
                    ],
                    'user' => [
                        'name' => $rating->user?->name ?? 'Pengguna',
                    ],
                    'created_at' => $rating->created_at,
                ];
            });

        return response()->json(['data' => $ratings]);
    }

    /**
     * Menampilkan detail satu paket tour.
     *
     * @param Request $request
     * @param PaketTour $paketTour
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
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
