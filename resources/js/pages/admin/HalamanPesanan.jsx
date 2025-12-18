import React, { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { formatTanggalIndo } from '../../utils/date';

const BADGES = {
    menunggu_verifikasi: 'bg-amber-100 text-amber-800 border-amber-200',
    menunggu_pembayaran: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    pembayaran_selesai: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pesanan_selesai: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function HalamanPesanan() {
    const { paketId } = useParams();
    const { state } = useLocation();
    const { data: pesanan, loading, error, refetch } = useFetch('/admin/pesanan');
    const { data: paketDetail } = useFetch(`/admin/paket/${paketId}/edit`, {
        enabled: !state?.paket,
    });

    const orders = useMemo(
        () => (pesanan ?? []).filter((order) => String(order.paket_tour?.id) === String(paketId)),
        [paketId, pesanan]
    );

    const paketInfo = useMemo(() => {
        if (state?.paket) return state.paket;
        if (paketDetail) return paketDetail;
        return orders[0]?.paket_tour;
    }, [orders, paketDetail, state?.paket]);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Pesanan Per Paket</p>
                    <h1 className="text-3xl font-bold text-slate-900">{paketInfo?.nama_paket ?? 'Paket'}</h1>
                    <div className="mt-2 text-slate-600 space-y-1 text-sm">
                        <p>Keberangkatan: {paketInfo?.jadwal_keberangkatan ? formatTanggalIndo(paketInfo.jadwal_keberangkatan) : '-'}</p>
                        <p>Kuota: {paketInfo?.kuota ?? '-'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        to="/admin/pesanan"
                        className="px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200"
                    >
                        Kembali
                    </Link>
                    <button
                        onClick={refetch}
                        className="px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                    >
                        Muat Ulang
                    </button>
                </div>
            </div>

            {loading && <p className="text-slate-600">Memuat pesanan...</p>}
            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    Gagal memuat data
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Pesanan</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => {
                            const badge =
                                BADGES[order.status_pesanan] ?? 'bg-slate-100 text-slate-700 border-slate-200';
                            return (
                                <tr key={order.id} className="hover:bg-slate-50/80">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-900">{order.user?.name ?? 'Customer'}</p>
                                        <p className="text-sm text-slate-500">{order.user?.email ?? '-'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <p className="font-semibold text-slate-900">#{order.id}</p>
                                        <p className="text-sm text-slate-500">Jumlah peserta: {order.jumlah_peserta}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${badge}`}>
                                            {order.status_pesanan?.replaceAll('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to={`/admin/pesanan/order/${order.id}`}
                                            className="px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                                        >
                                            Peserta
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {!loading && orders.length === 0 && (
                            <tr>
                                <td className="px-6 py-6 text-center text-slate-500" colSpan={4}>
                                    Belum ada pesanan untuk paket ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
