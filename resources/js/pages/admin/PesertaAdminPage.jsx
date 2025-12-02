import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';
import useFetch from '../../hooks/useFetch';

export default function PesertaAdminPage() {
    const { id } = useParams();
    const { data: pesanan, loading, error, refetch } = useFetch(`/admin/pesanan/${id}`);
    const [processing, setProcessing] = useState(false);
    const [filter, setFilter] = useState('all');

    const updateStatus = async (pesertaId, action) => {
        setProcessing(true);
        try {
            await api.put(`/admin/peserta/${pesertaId}/${action}`);
            refetch();
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const filteredPeserta = (pesanan?.pesertas ?? []).filter((p) => {
        if (filter === 'verified') return p.status_verifikasi === 'diverifikasi';
        if (filter === 'unverified') return p.status_verifikasi !== 'diverifikasi';
        return true;
    });

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

    if (loading) return <p className="text-slate-600">Memuat peserta...</p>;
    if (error) return <p className="text-red-600">Gagal memuat data</p>;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Halaman Data Peserta</p>
                <h1 className="text-3xl font-bold text-slate-900">Pesanan #{pesanan?.id}</h1>
                <p className="text-slate-600">Verifikasi identitas peserta.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <button
                        className={`px-3 py-2 text-sm font-semibold rounded-lg ${
                            filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-700 bg-white border border-slate-200'
                        }`}
                        onClick={() => setFilter('all')}
                    >
                        Semua ({(pesanan?.pesertas ?? []).length})
                    </button>
                    <button
                        className={`px-3 py-2 text-sm font-semibold rounded-lg ${
                            filter === 'unverified'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-700 bg-white border border-slate-200'
                        }`}
                        onClick={() => setFilter('unverified')}
                    >
                        Belum diverifikasi (
                        {(pesanan?.pesertas ?? []).filter((p) => p.status_verifikasi !== 'diverifikasi').length})
                    </button>
                    <button
                        className={`px-3 py-2 text-sm font-semibold rounded-lg ${
                            filter === 'verified'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-700 bg-white border border-slate-200'
                        }`}
                        onClick={() => setFilter('verified')}
                    >
                        Diverifikasi ({(pesanan?.pesertas ?? []).filter((p) => p.status_verifikasi === 'diverifikasi').length})
                    </button>
                </div>

                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3">Nama</th>
                            <th className="px-6 py-3">Telepon</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Alamat</th>
                            <th className="px-6 py-3">Foto Identitas</th>
                            <th className="px-6 py-3">Paspor</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPeserta.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/80">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-900">{p.nama_lengkap}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">{p.telepon ?? '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{p.email ?? '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{p.alamat ?? '-'}</td>
                                <td className="px-6 py-4">{renderDokumenLink('Lihat Foto', p.foto_identitas)}</td>
                                <td className="px-6 py-4">{renderDokumenLink('Lihat Paspor', p.paspor)}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                        {p.status_verifikasi}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => updateStatus(p.id, 'verify')}
                                            disabled={processing}
                                            className="px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                                        >
                                            Verifikasi
                                        </button>
                                        <button
                                            onClick={() => updateStatus(p.id, 'reject')}
                                            disabled={processing}
                                            className="px-3 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
                                        >
                                            Tolak
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredPeserta.length === 0 && (
                            <tr>
                                <td className="px-6 py-6 text-center text-slate-500" colSpan={8}>
                                    Tidak ada peserta pada filter ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
