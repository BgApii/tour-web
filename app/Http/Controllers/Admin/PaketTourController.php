<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaketTour;
use Illuminate\Http\Request;

class PaketTourController extends Controller
{
    public function index()
    {
        $paket = PaketTour::all();
        return view('admin.paket.index', compact('paket'));
    }

    public function create()
    {
        return view('admin.paket.create');
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
            'durasi' => 'required|integer|min:1',
            'wajib_paspor' => 'boolean',
            'wajib_identitas' => 'boolean',
            'tampil_di_katalog' => 'boolean',
        ]);

        $data = $request->only([
            'nama_paket',
            'destinasi',
            'include',
            'harga_per_peserta',
            'jadwal_keberangkatan',
            'kuota',
            'durasi',
        ]);

        $data['wajib_paspor'] = $request->boolean('wajib_paspor');
        $data['wajib_identitas'] = $request->boolean('wajib_identitas');
        $data['tampil_di_katalog'] = $request->boolean('tampil_di_katalog');
        $data['banner'] = $request->file('banner')->store('banners', 'public');

        PaketTour::create($data);

        return redirect()->route('admin.paket.index');
    }

    public function edit(PaketTour $paketTour)
    {
        return view('admin.paket.edit', compact('paketTour'));
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
            'durasi' => 'required|integer|min:1',
            'wajib_paspor' => 'boolean',
            'wajib_identitas' => 'boolean',
            'tampil_di_katalog' => 'boolean',
        ]);

        $data = $request->only([
            'nama_paket',
            'destinasi',
            'include',
            'harga_per_peserta',
            'jadwal_keberangkatan',
            'kuota',
            'durasi',
        ]);

        $data['wajib_paspor'] = $request->boolean('wajib_paspor');
        $data['wajib_identitas'] = $request->boolean('wajib_identitas');
        $data['tampil_di_katalog'] = $request->boolean('tampil_di_katalog');

        if ($request->hasFile('banner')) {
            $data['banner'] = $request->file('banner')->store('banners', 'public');
        }

        $paketTour->update($data);
        return redirect()->route('admin.paket.index');
    }

    public function destroy(PaketTour $paketTour)
    {
        $paketTour->delete();
        return redirect()->route('admin.paket.index');
    }

    public function hide(PaketTour $paketTour)
    {
        $paketTour->update(['tampil_di_katalog' => false]);
        return back();
    }

    public function showPaket(PaketTour $paketTour)
    {
        $paketTour->update(['tampil_di_katalog' => true]);
        return back();
    }
}
