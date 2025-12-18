import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';
import useFetch from '../../hooks/useFetch';

export default function HalamanDataPeserta() {
    const { id } = useParams();
    const { data: pesanan, loading, error, refetch } = useFetch(`/admin/pesanan/${id}`);
    const [processing, setProcessing] = useState(false);
    const [alasan, setAlasan] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const buildStorageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        if (path.startsWith('/storage')) return path;
        return `/storage/${path}`;
    };

    const renderDokumenLink = (label, path) => {
        const url = buildStorageUrl(path);
        if (!url) return <span className="text-slate-400 text-sm">-</span>;
        return (
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-700 font-semibold hover:underline text-sm"
            >
                {label}
            </a>
        );
    };

    const verifyPesanan = async () => {
        setProcessing(true);
        setErrorMessage('');
        try {
            await api.put(`/admin/pesanan/${id}/verify`);
            refetch();
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Gagal memverifikasi pesanan');
        } finally {
            setProcessing(false);
        }
    };

    const rejectPesanan = async () => {
        if (!alasan.trim()) {
            setErrorMessage('Alasan penolakan wajib diisi');
            return;
        }
        setProcessing(true);
        setErrorMessage('');
        try {
            await api.put(`/admin/pesanan/${id}/reject`, { alasan_penolakan: alasan });
            refetch();
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Gagal menolak pesanan');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <p className="text-slate-600">Memuat peserta...</p>;
    if (error) return <p className="text-red-600">Gagal memuat data</p>;

    const pesertaList = pesanan?.pesertas ?? [];

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Halaman Data Peserta</p>
                <h1 className="text-3xl font-bold text-slate-900">Pesanan #{pesanan?.id}</h1>
                <p className="text-slate-600">Verifikasi identitas peserta per pesanan.</p>
                {pesanan?.alasan_penolakan && (
                    <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        Alasan penolakan: {pesanan.alasan_penolakan}
                    </div>
                )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={verifyPesanan}
                            disabled={processing}
                            className="px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 disabled:opacity-60"
                        >
                            Verifikasi Pesanan
                        </button>
                        <button
                            onClick={rejectPesanan}
                            disabled={processing}
                            className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-60"
                        >
                            Tolak Pesanan
                        </button>
                    </div>
                    <div className="flex-1">
                        <textarea
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            placeholder="Isi alasan penolakan jika pesanan ditolak"
                            value={alasan}
                            onChange={(e) => setAlasan(e.target.value)}
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div className="px-6 py-3 text-sm text-red-700 bg-red-50 border-b border-red-100">{errorMessage}</div>
                )}

                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3">Nama</th>
                            <th className="px-6 py-3">Telepon</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Alamat</th>
                            <th className="px-6 py-3">Foto Identitas</th>
                            <th className="px-6 py-3">Foto Paspor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pesertaList.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/80">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-900">{p.nama_lengkap}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">{p.telepon ?? '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{p.email ?? '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{p.alamat ?? '-'}</td>
                                <td className="px-6 py-4">{renderDokumenLink('Lihat Foto', p.foto_identitas)}</td>
                                <td className="px-6 py-4">{renderDokumenLink('Lihat Paspor', p.foto_paspor)}</td>
                            </tr>
                        ))}
                        {pesertaList.length === 0 && (
                            <tr>
                                <td className="px-6 py-6 text-center text-slate-500" colSpan={6}>
                                    Tidak ada peserta pada pesanan ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
