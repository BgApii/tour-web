<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use Illuminate\Http\Request;

class PesertaController extends Controller
{
    public function verify(Pesanan $pesanan)
    {
        $pesanan->update([
            'status_pesanan' => 'menunggu_pembayaran',
            'alasan_penolakan' => null,
        ]);

        if (request()->expectsJson()) {
            return response()->json([
                'message' => 'Pesanan diverifikasi',
                'pesanan' => $pesanan->fresh('pesertas'),
            ]);
        }

        return back()->with('success', 'Pesanan diverifikasi');
    }

    public function reject(Request $request, Pesanan $pesanan)
    {
        $validated = $request->validate([
            'alasan_penolakan' => 'required|string',
        ]);

        $pesanan->update([
            'status_pesanan' => 'pesanan_ditolak',
            'alasan_penolakan' => $validated['alasan_penolakan'],
        ]);

        if (request()->expectsJson()) {
            return response()->json([
                'message' => 'Pesanan ditolak',
                'pesanan' => $pesanan->fresh('pesertas'),
            ]);
        }

        return back()->with('error', 'Pesanan ditolak');
    }
}
