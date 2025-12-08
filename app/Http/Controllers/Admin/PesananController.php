<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use Illuminate\Http\Request;

/**
 * Controller admin untuk melihat detail dan daftar pesanan.
 */
class PesananController extends Controller
{
    /**
     * Menampilkan semua pesanan beserta relasi pendukung.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\View\View
     */
    public function index(Request $request)
    {
        // show all pesanan by group paket
        $pesanan = Pesanan::with('paketTour', 'user', 'pesertas')->latest()->get();

        if ($request->expectsJson()) {
            return response()->json(['data' => $pesanan]);
        }

        return view('app');
    }

    /**
     * Menampilkan detail satu pesanan.
     *
     * @param Request $request
     * @param Pesanan $pesanan
     * @return \Illuminate\Http\JsonResponse|\Illuminate\View\View
     */
    public function show(Request $request, Pesanan $pesanan)
    {
        $pesanan->load('pesertas');

        if ($request->expectsJson()) {
            return response()->json(['data' => $pesanan]);
        }

        return view('app');
    }
}
