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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->increments('id_pembayaran');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('id_pesanan')->constrained('pesanans')->cascadeOnDelete();
            $table->string('channel_pembayaran', 50)->nullable();
            $table->enum('status_pembayaran', ['pending', 'settlement', 'expire']);
            $table->integer('jumlah_pembayaran');
            $table->string('token_pembayaran', 255)->nullable();
            $table->string('id_transaksi_midtrans', 100)->nullable();
            $table->timestamp('waktu_dibuat')->useCurrent();
            $table->timestamp('waktu_dibayar')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
