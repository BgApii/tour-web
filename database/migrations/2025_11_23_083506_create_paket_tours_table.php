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
        Schema::create('paket_tours', function (Blueprint $table) {
            $table->id();
            $table->string('nama_paket');
            $table->string('banner');
            $table->text('destinasi');
            $table->text('include')->nullable();
            $table->decimal('harga_per_peserta', 12, 2);
            $table->date('jadwal_keberangkatan');
            $table->integer('kuota');
            $table->integer('lama_hari');
            $table->integer('lama_malam');
            $table->boolean('wajib_paspor')->default(false);
            $table->boolean('wajib_identitas')->default(true);
            $table->boolean('tampil_di_katalog')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paket_tours');
    }
};
