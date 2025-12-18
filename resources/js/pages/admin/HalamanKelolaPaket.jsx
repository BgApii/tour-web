import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import useFetch from '../../hooks/useFetch';
import { formatTanggalIndo } from '../../utils/date';

export default function HalamanKelolaPaket() {
    const { data: paket, loading, error, refetch } = useFetch('/admin/paket');
    const [processing, setProcessing] = useState(false);

    const toggleVisibility = async (id, visible) => {
        setProcessing(true);
        const url = `/admin/paket/${id}/${visible ? 'hide' : 'show'}`;
        const method = 'put';
        try {
            await api[method](url);
            refetch();
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const remove = async (id) => {
        if (!window.confirm('Hapus paket ini?')) return;
        setProcessing(true);
        try {
            await api.delete(`/admin/paket/${id}`);
            refetch();
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Halaman Kelola Paket</p>
                    <h1 className="text-3xl font-bold text-slate-900">Atur katalog paket tour</h1>
                </div>
                <Link
                    to="/admin/paket/buat"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                    Tambah Paket
                </Link>
            </div>

            {loading && <p className="text-slate-600">Memuat paket...</p>}
            {error && <p className="text-red-600">Gagal memuat paket</p>}

            <div className="bg-white border border-slate-200 shadow rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3">Paket</th>
                            <th className="px-6 py-3">Harga</th>
                            <th className="px-6 py-3">Jadwal</th>
                            <th className="px-6 py-3">Tampil</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {(paket ?? []).map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-900">{item.nama_paket}</p>
                                    <p className="text-sm text-slate-500">{item.destinasi}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">
                                    Rp {Number(item.harga_per_peserta ?? 0).toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">
                                    {formatTanggalIndo(item.jadwal_keberangkatan)}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            item.tampil_di_katalog ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                                        }`}
                                    >
                                        {item.tampil_di_katalog ? 'Tampil' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            to={`/admin/paket/${item.id}/edit`}
                                            className="px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => toggleVisibility(item.id, item.tampil_di_katalog)}
                                            disabled={processing}
                                            className="px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100"
                                        >
                                            {item.tampil_di_katalog ? 'Sembunyikan' : 'Tampilkan'}
                                        </button>
                                        <button
                                            onClick={() => remove(item.id)}
                                            disabled={processing}
                                            className="px-3 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && (paket ?? []).length === 0 && (
                            <tr>
                                <td className="px-6 py-6 text-center text-slate-500" colSpan={5}>
                                    Belum ada paket tour.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
