<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use Illuminate\Http\Request;

class RekapitulasiController extends Controller
{
    public function index(Request $request)
    {
        $query = Pesanan::with(['paketTour', 'user'])
            ->where('status_pesanan', 'pembayaran_selesai');

        if ($request->filled('bulan')) {
            $query->whereMonth('created_at', $request->integer('bulan'));
        }

        if ($request->filled('tahun')) {
            $query->whereYear('created_at', $request->integer('tahun'));
        }

        $rekap = $query->get()->groupBy('paket_id')->map(function ($items) {
            $paket = $items->first()->paketTour;
            $detail = $items->map(function ($pesanan) {
                return [
                    'customer' => $pesanan->user?->name,
                    'jumlah_peserta' => $pesanan->jumlah_peserta,
                    'harga' => $pesanan->paketTour?->harga_per_peserta,
                ];
            })->values();

            return [
                'paket_id' => $paket?->id,
                'paket' => $paket,
                'pesanan' => $detail,
            ];
        })->values();

        if ($request->expectsJson()) {
            return response()->json(['data' => $rekap]);
        }

        return view('app');
    }
}
