<?php

use App\Models\Pesanan;
use App\Models\Peserta;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('pesanans', 'kode')) {
            Schema::table('pesanans', function (Blueprint $table) {
                $table->string('kode', 24)->nullable()->unique()->after('id');
            });
        }

        if (!Schema::hasColumn('pesertas', 'kode')) {
            Schema::table('pesertas', function (Blueprint $table) {
                $table->string('kode', 24)->nullable()->unique()->after('id');
            });
        }

        // Seed kode untuk data yang sudah ada tanpa menimpa yang sudah terisi
        $counterByDate = [];
        Pesanan::orderBy('id')->chunkById(200, function ($pesanans) use (&$counterByDate) {
            foreach ($pesanans as $pesanan) {
                if (!empty($pesanan->kode)) {
                    continue;
                }
                $dateKey = Carbon::parse($pesanan->created_at ?? now())->format('Ymd');
                $counterByDate[$dateKey] = ($counterByDate[$dateKey] ?? 0) + 1;
                $seq = str_pad($counterByDate[$dateKey], 3, '0', STR_PAD_LEFT);
                $pesanan->kode = "PSN-{$dateKey}-{$seq}";
                $pesanan->save();
            }
        });

        Peserta::with('pesanan')->orderBy('id')->chunkById(200, function ($pesertas) {
            $pesertaCounter = [];

            foreach ($pesertas as $peserta) {
                if (!empty($peserta->kode)) {
                    continue;
                }

                $pesanan = $peserta->pesanan;
                if (!$pesanan) {
                    continue;
                }

                $orderKey = optional($pesanan)->kode;
                $pesananSeq = null;
                if ($orderKey && preg_match('/PSN-\d{8}-(\d{3})/', $orderKey, $matches)) {
                    $pesananSeq = $matches[1];
                } else {
                    $pesananSeq = str_pad((string) $pesanan->id, 3, '0', STR_PAD_LEFT);
                }

                $pesertaCounter[$pesanan->id] = ($pesertaCounter[$pesanan->id] ?? 0) + 1;
                $urutanPeserta = $pesertaCounter[$pesanan->id];
                $candidate = '';
                do {
                    $candidate = "PST-{$pesananSeq}-" . str_pad((string) $urutanPeserta, 2, '0', STR_PAD_LEFT);
                    $urutanPeserta++;
                } while (Peserta::where('kode', $candidate)->exists());

                // Normalize counter after uniqueness adjustment
                $pesertaCounter[$pesanan->id] = $urutanPeserta - 1;

                $peserta->kode = $candidate;
                $peserta->save();
            }
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('pesertas', 'kode')) {
            Schema::table('pesertas', function (Blueprint $table) {
                $table->dropUnique(['kode']);
                $table->dropColumn('kode');
            });
        }

        if (Schema::hasColumn('pesanans', 'kode')) {
            Schema::table('pesanans', function (Blueprint $table) {
                $table->dropUnique(['kode']);
                $table->dropColumn('kode');
            });
        }
    }
};
