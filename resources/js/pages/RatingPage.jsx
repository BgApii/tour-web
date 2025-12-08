import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import useFetch from '../hooks/useFetch';

export default function RatingPage() {
    const { id } = useParams();
    const { data: paket } = useFetch(`/api/paket/${id}`);
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
            const response = await api.post(`/paket/${id}/rating`, {
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

    return (
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl shadow p-8 space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Form Rating</p>
                <h1 className="text-3xl font-bold text-slate-900">Beri ulasan untuk {paket?.nama_paket}</h1>
                <p className="text-slate-600">Nilai dari 1-5 dan tulis pengalamanmu.</p>
            </div>
            {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">{message}</div>}
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
                    className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                >
                    {saving ? 'Menyimpan...' : 'Kirim Rating'}
                </button>
            </form>
        </div>
    );
}
