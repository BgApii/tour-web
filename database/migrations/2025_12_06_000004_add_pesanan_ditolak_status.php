<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('pesanans')) {
            return;
        }

        DB::statement(
            "ALTER TABLE pesanans MODIFY status_pesanan ENUM('menunggu_verifikasi','menunggu_pembayaran','pembayaran_selesai','pesanan_selesai','pesanan_ditolak') NOT NULL DEFAULT 'menunggu_verifikasi'"
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('pesanans')) {
            return;
        }

        DB::statement(
            "ALTER TABLE pesanans MODIFY status_pesanan ENUM('menunggu_verifikasi','menunggu_pembayaran','pembayaran_selesai','pesanan_selesai') NOT NULL DEFAULT 'menunggu_verifikasi'"
        );
    }
};
