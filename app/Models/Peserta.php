<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peserta extends Model
{
    protected $fillable = [
        'pesanan_id',
        'nama_lengkap',
        'alamat',
        'telepon',
        'email',
        'foto_identitas',
        'foto_paspor',
    ];

    public $timestamps = false;

    public const UPDATED_AT = null;

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class);
    }
}
