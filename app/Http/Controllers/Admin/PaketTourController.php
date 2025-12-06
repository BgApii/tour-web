<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaketTour;
use Illuminate\Http\Request;

class PaketTourController extends Controller
{
    public function index(Request $request)
    {
        $paket = PaketTour::all();

        if ($request->expectsJson()) {
            return response()->json(['data' => $paket]);
        }

        return view('app');
    }

    public function create(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'ok']);
        }

        return view('app');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_paket' => 'required',
            'banner' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'destinasi' => 'required',
            'include' => 'required|string',
            'harga_per_peserta' => 'required|numeric',
            'jadwal_keberangkatan' => 'required|date',
            'kuota' => 'required|integer|min:1',
            'lama_hari' => 'required|integer|min:0',
            'lama_malam' => 'required|integer|min:0',
            'wajib_paspor' => 'nullable|in:on,off,1,0,true,false',
            'wajib_identitas' => 'nullable|in:on,off,1,0,true,false',
            'tampil_di_katalog' => 'nullable|in:on,off,1,0,true,false',
        ]);

        $data = $request->only([
            'nama_paket',
            'destinasi',
            'include',
            'harga_per_peserta',
            'jadwal_keberangkatan',
            'kuota',
            'lama_hari',
            'lama_malam',
        ]);

        $data['wajib_paspor'] = $request->boolean('wajib_paspor');
        $data['wajib_identitas'] = $request->boolean('wajib_identitas');
        $data['tampil_di_katalog'] = $request->boolean('tampil_di_katalog');
        $data['banner'] = $request->file('banner')->store('banners', 'public');

        $paket = PaketTour::create($data);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Paket berhasil dibuat',
                'data' => $paket,
            ], 201);
        }

        return redirect()->route('admin.paket.index');
    }

    public function edit(Request $request, PaketTour $paketTour)
    {
        if ($request->expectsJson()) {
            return response()->json(['data' => $paketTour]);
        }

        return view('app');
    }

    public function update(Request $request, PaketTour $paketTour)
    {
        $request->validate([
            'nama_paket' => 'required',
            'banner' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'destinasi' => 'required',
            'include' => 'required|string',
            'harga_per_peserta' => 'required|numeric',
            'jadwal_keberangkatan' => 'required|date',
            'kuota' => 'required|integer|min:1',
            'lama_hari' => 'required|integer|min:0',
            'lama_malam' => 'required|integer|min:0',
            'wajib_paspor' => 'nullable|in:on,off,1,0,true,false',
            'wajib_identitas' => 'nullable|in:on,off,1,0,true,false',
            'tampil_di_katalog' => 'nullable|in:on,off,1,0,true,false',
        ]);

        $data = $request->only([
            'nama_paket',
            'destinasi',
            'include',
            'harga_per_peserta',
            'jadwal_keberangkatan',
            'kuota',
            'lama_hari',
            'lama_malam',
        ]);

        $data['wajib_paspor'] = $request->boolean('wajib_paspor');
        $data['wajib_identitas'] = $request->boolean('wajib_identitas');
        $data['tampil_di_katalog'] = $request->boolean('tampil_di_katalog');

        if ($request->hasFile('banner')) {
            $data['banner'] = $request->file('banner')->store('banners', 'public');
        }

        $paketTour->update($data);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Paket diperbarui',
                'data' => $paketTour,
            ]);
        }

        return redirect()->route('admin.paket.index');
    }

    public function destroy(PaketTour $paketTour)
    {
        $paketTour->delete();

        if (request()->expectsJson()) {
            return response()->json(['message' => 'Paket dihapus']);
        }

        return redirect()->route('admin.paket.index');
    }

    public function hide(PaketTour $paketTour)
    {
        $paketTour->update(['tampil_di_katalog' => false]);

        if (request()->expectsJson()) {
            return response()->json(['message' => 'Paket disembunyikan', 'data' => $paketTour]);
        }

        return back();
    }

    public function showPaket(PaketTour $paketTour)
    {
        $paketTour->update(['tampil_di_katalog' => true]);

        if (request()->expectsJson()) {
            return response()->json(['message' => 'Paket ditampilkan', 'data' => $paketTour]);
        }

        return back();
    }
}
