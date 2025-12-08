<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    protected $fillable = [
        'user_id',
        'paket_id',
        'jumlah_peserta',
        'status_pesanan',
        'alasan_penolakan',
        'tanggal_pemesanan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paketTour()
    {
        return $this->belongsTo(PaketTour::class, 'paket_id');
    }

    public function pesertas()
    {
        return $this->hasMany(Peserta::class);
    }

    public function pembayarans()
    {
        return $this->hasMany(Pembayaran::class, 'id_pesanan');
    }

    /**
     * Rating yang diberikan pengguna pada paket ini (jika ada).
     */
    public function rating()
    {
        return $this->hasOne(Rating::class, 'paket_id', 'paket_id')
            ->where('user_id', $this->user_id);
    }
}
