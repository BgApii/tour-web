import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../lib/api';
import useFetch from '../hooks/useFetch';

const BADGES = {
    menunggu_verifikasi: 'bg-amber-100 text-amber-800 border-amber-200',
    menunggu_pembayaran: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    pembayaran_selesai: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pesanan_selesai: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pesanan_ditolak: 'bg-red-100 text-red-800 border-red-200',
};

const FILTERS = [
    { value: 'menunggu_verifikasi', label: 'Menunggu Verifikasi' },
    { value: 'menunggu_pembayaran', label: 'Menunggu Pembayaran' },
    { value: 'pembayaran_selesai', label: 'Pembayaran Selesai' },
    { value: 'pesanan_selesai', label: 'Pesanan Selesai' },
    { value: 'pesanan_ditolak', label: 'Pesanan Ditolak' },
];

export default function HalamanPesananSaya() {
    const { data: pesanan, loading, error, refetch } = useFetch('/pesanan-saya');
    const { search } = useLocation();
    const queryStatus = useMemo(() => new URLSearchParams(search).get('status'), [search]);
    const [filter, setFilter] = useState(() => {
        return FILTERS.some((f) => f.value === queryStatus) ? queryStatus : 'menunggu_verifikasi';
    });
    const [completing, setCompleting] = useState(null);
    const [actionError, setActionError] = useState('');

    useEffect(() => {
        if (FILTERS.some((f) => f.value === queryStatus)) {
            setFilter(queryStatus);
        }
    }, [queryStatus]);

    const filteredOrders = useMemo(() => {
        return (pesanan ?? []).filter((order) => order.status_pesanan === filter);
    }, [pesanan, filter]);

    const markSelesai = async (orderId) => {
        setCompleting(orderId);
        setActionError('');
        try {
            await api.post(`/pesanan/${orderId}/selesai`);
            refetch();
        } catch (err) {
            setActionError(err.response?.data?.message || 'Gagal menandai pesanan selesai');
        } finally {
            setCompleting(null);
        }
    };

    return (
        <div className="space-y-6 pt-6 pb-6">
            <div className="bg-white border border-slate-200 shadow rounded-3xl p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Pesanan Saya</p>
                <h1 className="text-3xl font-bold text-slate-900">Pantau semua perjalananmu</h1>
                <p className="text-slate-600">Isi data peserta, lakukan pembayaran, dan cek status verifikasi.</p>
            </div>

            <div className="overflow-x-auto -mx-1">
                <div className="flex flex-nowrap gap-2 px-1 pb-2">
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`flex-shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-semibold border transition ${
                                filter === f.value
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {actionError && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{actionError}</div>
            )}

            {loading && <p className="text-slate-600">Memuat pesanan...</p>}
            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    Gagal memuat pesanan
                    <button onClick={refetch} className="ml-3 text-indigo-700 font-semibold">
                        Coba lagi
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {filteredOrders.map((order) => {
                    const badge = BADGES[order.status_pesanan] ?? 'bg-slate-100 text-slate-700 border-slate-200';
                    return (
                        <div key={order.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500">Paket</p>
                                    <h2 className="text-xl font-semibold text-slate-900">{order.paket_tour?.nama_paket}</h2>
                                    <p className="text-sm text-slate-600">Jumlah peserta: {order.jumlah_peserta}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full border text-xs font-semibold self-start ${badge}`}>
                                    {order.status_pesanan?.replaceAll('_', ' ')}
                                </span>
                            </div>
                            {filter === 'menunggu_verifikasi' && (
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between gap-4">
                                    <p className="text-sm text-slate-500">Lengkapi data peserta</p>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        <Link
                                            to={`/pesanan/${order.id}/data-peserta`}
                                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                                        >
                                            Lengkapi Peserta
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {filter === 'menunggu_pembayaran' && (
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between gap-4">
                                    <p className="text-xs text-slate-500">Lakukan pembayaran</p>
                                    <p className="font-semibold text-slate-800 mt-2">
                                        Total estimasi: Rp{' '}
                                        {(
                                            Number(order.paket_tour?.harga_per_peserta ?? 0) * (order.jumlah_peserta ?? 1)
                                        ).toLocaleString('id-ID')}
                                    </p>
                                    <Link
                                        to={`/pembayaran/${order.id}/metode`}
                                        className="mt-3 inline-flex px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                                    >
                                        Bayar Sekarang
                                    </Link>
                                </div>
                            )}

                            {filter === 'pembayaran_selesai' && (
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-slate-600 mb-4">Pembayaran telah selesai</p>
                                        <p className="text-sm text-slate-600">Tekan pesanan selesai jika sudah melakukan perjalanan tour</p>
                                    </div>
                                    <button
                                        onClick={() => markSelesai(order.id)}
                                        disabled={completing === order.id}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
                                    >
                                        {completing === order.id ? 'Memproses...' : 'Pesanan Selesai'}
                                    </button>
                                </div>
                            )}

                            {filter === 'pesanan_selesai' && (
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between gap-4">
                                    <p className="text-sm text-slate-600 mb-2">
                                        {order.rating ? 'Rating sudah dikirim' : 'Berikan ulasan perjalananmu'}
                                    </p>
                                    {order.rating ? (
                                        <button
                                            type="button"
                                            disabled
                                            className="inline-flex px-4 py-2 bg-slate-200 text-slate-500 rounded-lg text-sm font-semibold cursor-not-allowed"
                                            title="Rating sudah dikirim"
                                        >
                                            Beri Rating
                                        </button>
                                    ) : (
                                        <Link
                                            to={`/pesanan/${order.id}/rating`}
                                            className="inline-flex px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                                        >
                                            Beri Rating
                                        </Link>
                                    )}
                                </div>
                            )}

                            {filter === 'pesanan_ditolak' && (
                                <div className="border border-red-200 rounded-xl p-4 bg-red-50 text-red-800 text-sm">
                                    Pesanan ditolak. {order.alasan_penolakan ? `Alasan: ${order.alasan_penolakan}` : ''}
                                </div>
                            )}
                        </div>
                    );
                })}

                {!loading && filteredOrders.length === 0 && (
                    <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                        Belum ada pesanan untuk filter ini. Mulai dengan memilih paket di katalog.
                    </div>
                )}
            </div>
        </div>
    );
}
