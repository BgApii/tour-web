<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pesanan;
use App\Models\PaketTour;

class PesananController extends Controller
{
    public function index(Request $request)
    {
        $pesanan = Pesanan::where('user_id', auth()->id())
            ->with('paketTour', 'pesertas')
            ->latest()
            ->get();

        if ($request->expectsJson()) {
            return response()->json(['data' => $pesanan]);
        }

        return view('app');
    }

    public function store(Request $request, PaketTour $paketTour = null)
    {
        $request->validate([
            'jumlah_peserta' => 'required|integer|min:1'
        ]);

        $paket = $paketTour ?? PaketTour::findOrFail($request->input('paket_id'));

        $pesanan = Pesanan::create([
            'user_id' => auth()->id(),
            'paket_id' => $paket->id,
            'jumlah_peserta' => $request->jumlah_peserta,
            'status_pesanan' => 'menunggu_verifikasi'
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Pesanan berhasil dibuat',
                'data' => $pesanan,
            ], 201);
        }

        return redirect('/pesanan-saya');
    }

    public function markSelesai(Request $request, Pesanan $pesanan)
    {
        if ($pesanan->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($pesanan->status_pesanan !== 'pembayaran_selesai') {
            return response()->json([
                'message' => 'Pesanan belum bisa diselesaikan',
            ], 422);
        }

        $pesanan->update([
            'status_pesanan' => 'pesanan_selesai',
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Pesanan ditandai selesai',
                'data' => $pesanan->fresh(),
            ]);
        }

        return redirect('/pesanan-saya')->with('success', 'Pesanan selesai');
    }
}
