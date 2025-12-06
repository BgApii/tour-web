<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Illuminate\Http\Request;
use Midtrans\Config as MidtransConfig;
use Midtrans\Snap;
use Midtrans\Transaction;
use Midtrans\CoreApi;

class PaymentController extends Controller
{
    protected function bootMidtrans(): void
    {
        MidtransConfig::$serverKey = config('services.midtrans.server_key');
        MidtransConfig::$isProduction = (bool) config('services.midtrans.is_production', false);
        MidtransConfig::$isSanitized = true;
        MidtransConfig::$is3ds = true;
    }

    public function createSnapToken(Request $request, Pesanan $pesanan)
    {
        $user = $request->user();

        if (! $user || ($user->id !== $pesanan->user_id && !in_array($user->role, ['admin', 'owner']))) {
            abort(403);
        }

        $pesanan->load('paketTour', 'user');

        if (!config('services.midtrans.server_key') || !config('services.midtrans.client_key')) {
            return response()->json([
                'message' => 'Konfigurasi Midtrans belum disetel',
            ], 202);
        }

        $this->bootMidtrans();

        $orderId = 'pesanan-'.$pesanan->id.'-'.time();
        $grossAmount = (int) ($pesanan->paketTour->harga_per_peserta * $pesanan->jumlah_peserta);

        $paymentType = $request->input('payment_type');
        $bank = strtolower($request->input('bank', 'bca'));

        $baseParams = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => [
                'first_name' => $pesanan->user->name ?? 'Customer',
                'email' => $pesanan->user->email ?? null,
                'phone' => $pesanan->user->phone ?? null,
            ],
            'item_details' => [
                [
                    'id' => $pesanan->paketTour->id,
                    'price' => (int) $pesanan->paketTour->harga_per_peserta,
                    'quantity' => $pesanan->jumlah_peserta,
                    'name' => $pesanan->paketTour->nama_paket,
                ],
            ],
        ];

        // Jika request bank_transfer, langsung charge Core API agar VA number tersedia
        if ($paymentType === 'bank_transfer') {
            $params = $baseParams;

            if ($bank === 'mandiri') {
                // Mandiri VA melalui e-channel
                $params['payment_type'] = 'echannel';
                $params['echannel'] = [
                    'bill_info1' => 'Payment for '.$pesanan->paketTour->nama_paket,
                    'bill_info2' => 'Tour',
                ];
            } else {
                $params['payment_type'] = 'bank_transfer';
                $params['bank_transfer'] = [
                    'bank' => $bank,
                ];
            }

            $charge = CoreApi::charge($params);

            return response()->json([
                'order_id' => $charge->order_id ?? $orderId,
                'transaction_status' => $charge->transaction_status ?? null,
                'va_numbers' => $charge->va_numbers ?? [],
                'permata_va_number' => $charge->permata_va_number ?? null,
                'bill_key' => $charge->bill_key ?? null,
                'biller_code' => $charge->biller_code ?? null,
                'company_code' => $charge->bill_key ?? $charge->company_code ?? $charge->biller_code ?? null,
                'gross_amount' => $charge->gross_amount ?? $grossAmount,
            ]);
        }

        // default: Snap token
        $params = array_merge($baseParams, [
            'callbacks' => [
                'finish' => url('/pesanan-saya'),
                'error' => url('/pesanan-saya'),
                'pending' => url('/pesanan-saya'),
            ],
        ]);

        $token = Snap::getSnapToken($params);

        return response()->json([
            'token' => $token,
            'order_id' => $orderId,
            'client_key' => config('services.midtrans.client_key'),
        ]);
    }

    public function confirm(Request $request, Pesanan $pesanan)
    {
        $user = $request->user();

        if (! $user || ($user->id !== $pesanan->user_id && !in_array($user->role, ['admin', 'owner']))) {
            abort(403);
        }

        $validated = $request->validate([
            'status_pesanan' => 'nullable|string',
            'transaction_status' => 'nullable|string',
            'payment_type' => 'nullable|string',
        ]);

        $status = $validated['status_pesanan'] ?? 'pembayaran_selesai';

        $pesanan->update([
            'status_pesanan' => $status,
        ]);

        return response()->json([
            'message' => 'Status pembayaran diperbarui',
            'data' => $pesanan->fresh(),
        ]);
    }

    public function status(Request $request, Pesanan $pesanan)
    {
        $orderId = $request->input('order_id');

        if (! $orderId) {
            return response()->json(['message' => 'order_id wajib diisi'], 422);
        }

        $this->bootMidtrans();

        try {
            $status = Transaction::status($orderId);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengambil status transaksi'], 500);
        }

        $transactionStatus = $status->transaction_status ?? null;
        $vaNumbers = $status->va_numbers ?? [];
        $companyCode = $status->bill_key ?? $status->company_code ?? $status->biller_code ?? null;
        $amount = $status->gross_amount ?? null;

        if (in_array($transactionStatus, ['capture', 'settlement'])) {
            $pesanan->update(['status_pesanan' => 'pembayaran_selesai']);
        } elseif ($transactionStatus === 'pending') {
            $pesanan->update(['status_pesanan' => 'menunggu_pembayaran']);
        }

        return response()->json([
            'transaction_status' => $transactionStatus,
            'va_numbers' => $vaNumbers,
            'company_code' => $companyCode,
            'bill_key' => $status->bill_key ?? null,
            'biller_code' => $status->biller_code ?? null,
            'gross_amount' => $amount,
            'order_id' => $orderId,
            'pesanan' => $pesanan->fresh(),
        ]);
    }
}
