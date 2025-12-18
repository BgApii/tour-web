import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import useFetch from '../hooks/useFetch';

const HalamanFormPemesanan = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: paket } = useFetch(`/api/paket/${id}`);
    const [jumlahPeserta, setJumlahPeserta] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post(`/pesan/${id}`, { jumlah_peserta: jumlahPeserta });
            navigate('/pesanan-saya');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat pesanan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow p-8 space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Form Pemesanan</p>
                <h1 className="text-3xl font-bold text-slate-900">Pesan paket {paket?.nama_paket ?? ''}</h1>
                <p className="text-slate-600">Isi jumlah peserta untuk melanjutkan.</p>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

            <form className="space-y-4" onSubmit={submit}>
                <div>
                    <label className="text-sm font-semibold text-slate-700">Jumlah Peserta</label>
                    <input
                        type="number"
                        min={1}
                        value={jumlahPeserta}
                        onChange={(e) => setJumlahPeserta(Number(e.target.value))}
                        className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                >
                    {loading ? 'Memproses...' : 'Buat Pesanan'}
                </button>
            </form>
        </div>
    );
};

export default HalamanFormPemesanan;
