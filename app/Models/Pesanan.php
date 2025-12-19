<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Pesanan extends Model
{
    protected $fillable = [
        'user_id',
        'paket_id',
        'jumlah_peserta',
        'status_pesanan',
        'alasan_penolakan',
        'tanggal_pemesanan',
        'kode',
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
     * Rating yang diberikan pengguna pada pesanan ini (jika ada).
     */
    public function rating()
    {
        return $this->hasOne(Rating::class, 'pesanan_id');
    }

    protected static function booted(): void
    {
        static::creating(function (self $pesanan) {
            if (empty($pesanan->kode)) {
                $pesanan->kode = self::generateKode($pesanan->paket_id);
            }
        });
    }

    protected static function generateKode(?int $paketId = null): string
    {
        $today = Carbon::now()->format('Ymd');

        $query = self::query()->whereNotNull('kode');
        if ($paketId) {
            $query->where('paket_id', $paketId);
        }

        $lastKode = $query->orderByDesc('created_at')->orderByDesc('id')->value('kode');

        $lastNumber = 0;
        if ($lastKode && preg_match('/PSN-\\d{8}-(\\d{3})/', $lastKode, $matches)) {
            $lastNumber = (int) $matches[1];
        } else {
            $existingCount = self::when($paketId, fn ($q) => $q->where('paket_id', $paketId))->count();
            $lastNumber = $existingCount;
        }

        $next = str_pad((string) ($lastNumber + 1), 3, '0', STR_PAD_LEFT);
        return "PSN-{$today}-{$next}";
    }
}
