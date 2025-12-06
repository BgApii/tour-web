<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $table = 'pembayaran';

    protected $primaryKey = 'id_pembayaran';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'id_pesanan',
        'channel_pembayaran',
        'status_pembayaran',
        'jumlah_pembayaran',
        'token_pembayaran',
        'id_transaksi_midtrans',
        'waktu_dibuat',
        'waktu_dibayar',
    ];

    protected $casts = [
        'jumlah_pembayaran' => 'integer',
        'waktu_dibuat' => 'datetime',
        'waktu_dibayar' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class, 'id_pesanan');
    }
}
