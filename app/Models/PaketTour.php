<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaketTour extends Model
{
    protected $fillable = [
        'nama_paket',
        'banner',
        'destinasi',
        'include',
        'harga_per_peserta',
        'jadwal_keberangkatan',
        'kuota',
        'durasi',
        'wajib_paspor',
        'wajib_identitas',
        'tampil_di_katalog'
    ];

    protected $casts = [
        'jadwal_keberangkatan' => 'date',
        'wajib_paspor' => 'boolean',
        'wajib_identitas' => 'boolean',
        'tampil_di_katalog' => 'boolean',
        'harga_per_peserta' => 'decimal:2',
    ];

    public function pesanans()
    {
        return $this->hasMany(Pesanan::class, 'paket_id');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'paket_id');
    }
}
