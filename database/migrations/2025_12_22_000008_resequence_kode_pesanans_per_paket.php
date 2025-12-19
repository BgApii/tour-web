<?php

use App\Models\Pesanan;
use App\Models\Peserta;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Hilangkan unique constraint (abaikan jika sudah tidak ada)
        if ($this->indexExists('pesanans', 'pesanans_kode_unique')) {
            DB::statement('ALTER TABLE `pesanans` DROP INDEX `pesanans_kode_unique`');
        }
        if ($this->indexExists('pesertas', 'pesertas_kode_unique')) {
            DB::statement('ALTER TABLE `pesertas` DROP INDEX `pesertas_kode_unique`');
        }

        // Resequence kode pesanan per paket
        $counterByPaket = [];
        Pesanan::orderBy('paket_id')
            ->orderBy('created_at')
            ->orderBy('id')
            ->chunkById(200, function ($pesanans) use (&$counterByPaket) {
                foreach ($pesanans as $pesanan) {
                    $counterByPaket[$pesanan->paket_id] = ($counterByPaket[$pesanan->paket_id] ?? 0) + 1;
                    $seq = str_pad((string) $counterByPaket[$pesanan->paket_id], 3, '0', STR_PAD_LEFT);
                    $dateKey = Carbon::parse($pesanan->created_at ?? now())->format('Ymd');

                    $pesanan->timestamps = false;
                    $pesanan->kode = "PSN-{$dateKey}-{$seq}";
                    $pesanan->save();
                }
            });

        // Resequence kode peserta per pesanan mengikuti kode pesanan baru
        $pesertaCounter = [];
        Peserta::with('pesanan')
            ->orderBy('id')
            ->chunkById(200, function ($pesertas) use (&$pesertaCounter) {
                foreach ($pesertas as $peserta) {
                    $pesanan = $peserta->pesanan;
                    if (!$pesanan || empty($pesanan->kode)) {
                        continue;
                    }

                    $pesananDate = Carbon::parse($pesanan->created_at ?? now())->format('Ymd');
                    $pesananSeq = null;
                    if (preg_match('/PSN-(\\d{8})-(\\d{3})/', $pesanan->kode, $matches)) {
                        $pesananDate = $matches[1];
                        $pesananSeq = $matches[2];
                    } else {
                        $pesananSeq = str_pad((string) $pesanan->id, 3, '0', STR_PAD_LEFT);
                    }

                    $pesertaCounter[$pesanan->id] = ($pesertaCounter[$pesanan->id] ?? 0) + 1;
                    $seqPeserta = str_pad((string) $pesertaCounter[$pesanan->id], 2, '0', STR_PAD_LEFT);

                    $peserta->kode = "PST-{$pesananDate}-{$pesananSeq}-P{$seqPeserta}";
                    $peserta->save();
                }
            });
    }

    public function down(): void
    {
        // No-op: kode dibiarkan apa adanya jika rollback.
    }

    private function indexExists(string $table, string $index): bool
    {
        $result = DB::select("SHOW INDEX FROM `{$table}` WHERE Key_name = ?", [$index]);
        return !empty($result);
    }
};
