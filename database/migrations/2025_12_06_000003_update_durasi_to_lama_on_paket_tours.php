<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('paket_tours', function (Blueprint $table) {
            if (Schema::hasColumn('paket_tours', 'durasi')) {
                $table->dropColumn('durasi');
            }

            if (! Schema::hasColumn('paket_tours', 'lama_hari')) {
                $table->integer('lama_hari')->after('kuota');
            }

            if (! Schema::hasColumn('paket_tours', 'lama_malam')) {
                $table->integer('lama_malam')->after('lama_hari');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paket_tours', function (Blueprint $table) {
            if (Schema::hasColumn('paket_tours', 'lama_hari')) {
                $table->dropColumn('lama_hari');
            }

            if (Schema::hasColumn('paket_tours', 'lama_malam')) {
                $table->dropColumn('lama_malam');
            }

            if (! Schema::hasColumn('paket_tours', 'durasi')) {
                $table->integer('durasi')->after('kuota');
            }
        });
    }
};
