import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import useFetch from '../hooks/useFetch';

export default function FormPenilaian() {
    const { id } = useParams();
    const { data: pesanan, loading, error: loadError } = useFetch(`/pesanan/${id}/peserta`);
    const navigate = useNavigate();
    const [nilai, setNilai] = useState(5);
    const [ulasan, setUlasan] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        setError(null);
        try {
            const response = await api.post(`/pesanan/${id}/rating`, {
                nilai_rating: nilai,
                ulasan,
            });
            setMessage(response.data.message ?? 'Rating tersimpan');
            navigate('/pesanan-saya?status=pesanan_selesai');
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message || 'Gagal menyimpan rating';
            setError(msg);
            if (status === 409) {
                navigate('/pesanan-saya?status=pesanan_selesai');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-slate-600">Memuat form rating...</p>;
    if (loadError) return <p className="text-red-600">Gagal memuat pesanan</p>;

    return (
        <div className="pt-6 pb-10 px-4 sm:px-0">
            <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl shadow p-6 space-y-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-semibold">Form Rating</p>
                        <h1 className="text-2xl font-bold text-slate-900">Beri ulasan untuk {pesanan?.paket_tour?.nama_paket}</h1>
                        <p className="text-xs text-slate-500">Pesanan #{pesanan?.kode ?? pesanan?.id}</p>
                        <p className="text-sm text-slate-600">Nilai dari 1-5 dan tulis pengalamanmu.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200"
                        aria-label="Kembali"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>
                {message && (
                    <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">{message}</div>
                )}
                {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
                <form className="space-y-4" onSubmit={submit}>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Nilai</label>
                        <select
                            value={nilai}
                            onChange={(e) => setNilai(Number(e.target.value))}
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Ulasan</label>
                        <textarea
                            rows={3}
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={ulasan}
                            onChange={(e) => setUlasan(e.target.value)}
                            placeholder="Ceritakan pengalaman terbaikmu"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {saving ? 'Menyimpan...' : 'Kirim Rating'}
                    </button>
                </form>
            </div>
        </div>
    );
}
