<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\PaketTour;
use Illuminate\Http\Request;

/**
 * Controller pelanggan untuk memberi rating dan ulasan pada paket tour.
 */
class RatingController extends Controller
{
    /**
     * Membuat atau memperbarui rating dan ulasan pengguna untuk paket.
     *
     * @param Request $request
     * @param PaketTour $paketTour
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, PaketTour $paketTour)
    {
        $request->validate([
            'nilai_rating' => 'required|integer|min:1|max:5',
            'ulasan' => 'nullable|string'
        ]);

        $existing = Rating::where('user_id', auth()->id())
            ->where('paket_id', $paketTour->id)
            ->first();

        if ($existing) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Rating sudah pernah diberikan',
                    'data' => $existing,
                ], 409);
            }

            return redirect('/pesanan-saya?status=pesanan_selesai')
                ->with('info', 'Rating sudah pernah diberikan untuk paket ini');
        }

        $rating = Rating::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'paket_id' => $paketTour->id
            ],
            [
                'nilai_rating' => $request->nilai_rating,
                'ulasan' => $request->ulasan
            ]
        );

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Terima kasih atas ulasan Anda!',
                'data' => $rating,
            ]);
        }

        return redirect('/pesanan-saya?status=pesanan_selesai')
            ->with('success', 'Terima kasih atas ulasan Anda!');
    }
}
