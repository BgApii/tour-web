import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import useFetch from '../hooks/useFetch';

const VA_METHODS = [
    { code: 'bca', name: 'BCA', color: '#0056a3' },
    { code: 'mandiri', name: 'Mandiri', color: '#f9b000' },
    { code: 'bni', name: 'BNI', color: '#006f61' },
    { code: 'bri', name: 'BRI', color: '#00529c' },
    { code: 'permata', name: 'Permata', color: '#007f5f' },
    { code: 'cimb', name: 'CIMB Niaga', color: '#a30034' },
    { code: 'seabank', name: 'SeaBank', color: '#f36f21' },
    { code: 'danamon', name: 'Danamon', color: '#f7941d' },
    { code: 'bsi', name: 'BSI', color: '#0d9488' },
    { code: 'other', name: 'Bank Lain', color: '#475569' },
];

export default function PaymentMethodPage() {
    const { orderId } = useParams();
    const { data: pesanan, loading } = useFetch(`/pesanan/${orderId}/peserta`);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [selectedVa, setSelectedVa] = useState(VA_METHODS[0]?.code ?? 'bca');
    const [vaInfo, setVaInfo] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [midtransOrderId, setMidtransOrderId] = useState(null);
    const pollRef = useRef(null);

    const extractVaInfo = (data) => {
        const info = {};

        const vaNumber =
            data?.va_numbers?.[0]?.va_number ||
            data?.permata_va_number ||
            data?.bca_va_number ||
            data?.va_number ||
            data?.virtual_account_number ||
            data?.bill_key;

        if (vaNumber) info.vaNumber = vaNumber;

        const bank = data?.va_numbers?.[0]?.bank || data?.bank || selectedVa;
        if (bank) info.bank = bank;

        const companyCode = data?.biller_code || data?.company_code || data?.bill_key || null;
        if (companyCode) info.companyCode = companyCode;

        const amount = data?.gross_amount || data?.jumlah_pembayaran || data?.amount || null;
        if (amount) info.amount = amount;

        return info;
    };

    const startVaPayment = async () => {
        setProcessing(true);
        setError(null);
        setPaymentSuccess(false);
        try {
            const response = await api.post(`/payments/${orderId}/snap-token`, {
                payment_type: 'bank_transfer',
                bank: selectedVa,
            });
            const info = extractVaInfo(response.data);
            setVaInfo(info);
            setMidtransOrderId(response.data.order_id || null);
            setTransactionStatus(response.data.transaction_status ?? 'pending');
            if (response.data.order_id) {
                startPolling(response.data.order_id);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memulai pembayaran');
        } finally {
            setProcessing(false);
        }
    };

    const startPolling = (order) => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
        }
        pollRef.current = setInterval(async () => {
            try {
                const res = await api.get(`/payments/${orderId}/status`, { params: { order_id: order } });
                setTransactionStatus(res.data.transaction_status);
                const info = extractVaInfo(res.data);
                setVaInfo((prev) => {
                    const next = { ...prev };
                    if (info.vaNumber) next.vaNumber = info.vaNumber;
                    if (info.bank) next.bank = info.bank;
                    if (info.companyCode) next.companyCode = info.companyCode;
                    if (info.amount) next.amount = info.amount;
                    return next;
                });
                if (['settlement', 'capture'].includes(res.data.transaction_status)) {
                    setPaymentSuccess(true);
                    clearInterval(pollRef.current);
                }
            } catch (err) {
                console.error(err);
            }
        }, 4000);
    };

    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    if (loading) return <p className="text-slate-600">Memuat pembayaran...</p>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow p-6 space-y-3">
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Halaman Metode Pembayaran</p>
                <h1 className="text-3xl font-bold text-slate-900">Pesanan #{pesanan?.id}</h1>
                <p className="text-slate-600">Pilih metode pembayaran Midtrans untuk paket {pesanan?.paket_tour?.nama_paket}.</p>
                <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-800">Virtual Account Bank</p>
                    <div className="grid md:grid-cols-2 gap-3">
                        {VA_METHODS.map((va) => (
                            <label
                                key={va.code}
                                className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition ${
                                    selectedVa === va.code ? 'border-indigo-400 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="va"
                                    value={va.code}
                                    checked={selectedVa === va.code}
                                    onChange={() => setSelectedVa(va.code)}
                                    className="text-indigo-600"
                                />
                                <span
                                    className="inline-flex items-center justify-center h-10 w-10 rounded-full text-white font-bold uppercase"
                                    style={{ backgroundColor: va.color }}
                                >
                                    {va.name.split(' ').map((w) => w[0]).join('').slice(0, 3)}
                                </span>
                                <span className="font-semibold text-slate-800">{va.name}</span>
                            </label>
                        ))}
                    </div>
                    {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
                    <button
                        onClick={startVaPayment}
                        disabled={processing}
                        className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {processing ? 'Memproses pembayaran...' : 'Bayar Sekarang'}
                    </button>
                    {transactionStatus && (
                        <p className="text-sm text-slate-600">
                            Status transaksi: <span className="font-semibold text-slate-800">{transactionStatus}</span>
                        </p>
                    )}
                </div>
            </div>

            {vaInfo && !paymentSuccess && (
                <div className="bg-white border border-slate-200 rounded-3xl shadow p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Instruksi Pembayaran</p>
                            <h2 className="text-2xl font-bold text-slate-900">Virtual Account {vaInfo.bank?.toUpperCase()}</h2>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <div className="border border-slate-200 rounded-xl px-4 py-3">
                            <p className="text-xs text-slate-500 uppercase">Jumlah yang harus dibayar</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {vaInfo.amount ? Number(vaInfo.amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '-'}
                            </p>
                        </div>
                        {vaInfo.companyCode && (
                            <div className="border border-slate-200 rounded-xl px-4 py-3">
                                <p className="text-xs text-slate-500 uppercase">Company Code</p>
                                <p className="text-lg font-semibold text-slate-900">{vaInfo.companyCode}</p>
                            </div>
                        )}
                        <div className="border border-slate-200 rounded-xl px-4 py-3">
                            <p className="text-xs text-slate-500 uppercase">Virtual Account Number</p>
                            <p className="text-lg font-semibold text-slate-900">{vaInfo.vaNumber ?? '-'}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={midtransOrderId ? () => startPolling(midtransOrderId) : startVaPayment}
                            disabled={processing}
                            className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {processing ? 'Memproses...' : 'Refresh Status'}
                        </button>
                        <span className="text-sm text-slate-500">Status: {transactionStatus ?? 'pending'}</span>
                    </div>
                </div>
            )}

            {paymentSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl shadow p-6 text-center space-y-3">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl">✓</div>
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-800">Pembayaran Berhasil</h2>
                    <p className="text-emerald-700">Terima kasih, pembayaran Anda telah kami terima.</p>
                </div>
            )}
        </div>
    );
}
