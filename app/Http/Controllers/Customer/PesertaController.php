<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Peserta;
use App\Models\Pesanan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PesertaController extends Controller
{
    public function create(Request $request, Pesanan $pesanan)
    {
        $pesanan->load('paketTour', 'pesertas');

        if ($request->expectsJson()) {
            return response()->json(['data' => $pesanan]);
        }

        return view('app');
    }

    public function store(Request $request, Pesanan $pesanan)
    {
        $wajibIdentitas = (bool) ($pesanan->paketTour->wajib_identitas ?? false);
        $wajibPaspor = (bool) ($pesanan->paketTour->wajib_paspor ?? false);

        $request->validate([
            'peserta' => 'required|array|min:1',
            'peserta.*.nama_lengkap' => 'required|string|max:255',
            'peserta.*.alamat' => 'required|string',
            'peserta.*.telepon' => 'required|string|max:50',
            'peserta.*.email' => 'required|email',
            'peserta.*.foto_identitas' => [
                Rule::requiredIf($wajibIdentitas),
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
            'peserta.*.foto_paspor' => [
                Rule::requiredIf($wajibPaspor),
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ]);

        foreach ($request->input('peserta', []) as $index => $data) {
            $identitasPath = null;
            $pasporPath = null;

            if ($request->hasFile("peserta.$index.foto_identitas")) {
                $identitasPath = $request->file("peserta.$index.foto_identitas")->store('identitas', 'public');
            }
            if ($request->hasFile("peserta.$index.foto_paspor")) {
                $pasporPath = $request->file("peserta.$index.foto_paspor")->store('paspor', 'public');
            }

            Peserta::create([
                'pesanan_id' => $pesanan->id,
                'nama_lengkap' => $data['nama_lengkap'],
                'alamat' => $data['alamat'],
                'telepon' => $data['telepon'],
                'email' => $data['email'],
                'foto_identitas' => $identitasPath,
                'foto_paspor' => $pasporPath,
            ]);
        }

        $pesanan->update(['status_pesanan' => 'menunggu_verifikasi']);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Data peserta disimpan',
                'data' => $pesanan->fresh('pesertas'),
            ]);
        }

        return redirect('/pesanan-saya')->with('success', 'Data peserta berhasil disimpan');
    }
}
