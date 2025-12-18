import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { formatTanggalIndo } from '../../utils/date';

export default function HalamanKelolaPesanan() {
    const { data: pesanan, loading: loadingPesanan, error: errorPesanan } = useFetch('/admin/pesanan');
    const { data: paket, loading: loadingPaket, error: errorPaket } = useFetch('/admin/paket');

    const paketTampil = useMemo(() => {
        const paketMap = new Map();
        (paket ?? [])
            .filter((p) => p.tampil_di_katalog)
            .forEach((p) => {
                paketMap.set(p.id, {
                    id: p.id,
                    nama_paket: p.nama_paket,
                    jadwal_keberangkatan: p.jadwal_keberangkatan,
                    kuota: p.kuota,
                    totalTerverifikasi: 0,
                });
            });

        (pesanan ?? []).forEach((order) => {
            const paketId = order.paket_tour?.id;
            if (!paketId || !paketMap.has(paketId)) return;
            const totalPeserta = (order.pesertas ?? []).length;
            paketMap.get(paketId).totalTerverifikasi += totalPeserta;
        });

        return Array.from(paketMap.values());
    }, [paket, pesanan]);

    const loading = loadingPesanan || loadingPaket;
    const error = errorPesanan || errorPaket;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Halaman Kelola Pesanan</p>
                <h1 className="text-3xl font-bold text-slate-900">Monitor pesanan customer</h1>
            </div>

            {loading && <p className="text-slate-600">Memuat pesanan...</p>}
            {error && <p className="text-red-600">Gagal memuat data</p>}

            <div className="bg-white border border-slate-200 shadow rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3">Tour</th>
                            <th className="px-6 py-3">Keberangkatan</th>
                            <th className="px-6 py-3">Terverifikasi</th>
                            <th className="px-6 py-3">Kuota</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paketTampil.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-900">{item.nama_paket}</p>
                                    <p className="text-sm text-slate-500">ID #{item.id}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">
                                    {item.jadwal_keberangkatan ? formatTanggalIndo(item.jadwal_keberangkatan) : '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">{item.totalTerverifikasi} peserta</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{item.kuota ?? '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        to={`/admin/pesanan/paket/${item.id}`}
                                        state={{ paket: item }}
                                        className="px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                                    >
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {!loading && paketTampil.length === 0 && (
                            <tr>
                                <td className="px-6 py-6 text-center text-slate-500" colSpan={5}>
                                    Tidak ada tour yang ditampilkan di katalog.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
