<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Pesanan;

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
        'kode',
    ];

    public $timestamps = false;

    public const UPDATED_AT = null;

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class);
    }

    protected static function booted(): void
    {
        static::creating(function (self $peserta) {
            if (empty($peserta->kode)) {
                $peserta->kode = self::generateKode($peserta);
            }
        });
    }

    protected static function generateKode(self $peserta): ?string
    {
        $pesanan = $peserta->pesanan ?? ($peserta->pesanan_id ? Pesanan::find($peserta->pesanan_id) : null);
        if (!$pesanan) {
            return null;
        }

        $pesananDate = optional($pesanan->created_at)->format('Ymd') ?: now()->format('Ymd');
        $pesananSeq = null;
        if ($pesanan->kode && preg_match('/PSN-(\\d{8})-(\\d{3})/', $pesanan->kode, $matches)) {
            $pesananDate = $matches[1];
            $pesananSeq = $matches[2];
        } else {
            $pesananSeq = str_pad((string) $pesanan->id, 3, '0', STR_PAD_LEFT);
        }

        $existingCount = self::where('pesanan_id', $pesanan->id)->count();
        $urutanPeserta = str_pad((string) ($existingCount + 1), 2, '0', STR_PAD_LEFT);

        return "PST-{$pesananDate}-{$pesananSeq}-P{$urutanPeserta}";
    }
}
