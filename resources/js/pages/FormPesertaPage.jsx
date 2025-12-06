import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import useFetch from '../hooks/useFetch';

const FormPesertaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: pesananData, loading } = useFetch(`/pesanan/${id}/peserta`);
    const pesertaCount = pesananData?.jumlah_peserta ?? 1;
    const wajibIdentitas = Boolean(pesananData?.paket_tour?.wajib_identitas);
    const wajibPaspor = Boolean(pesananData?.paket_tour?.wajib_paspor);

    const [peserta, setPeserta] = useState([]);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (pesananData) {
            const initial = Array.from({ length: pesertaCount }).map((_, idx) => ({
                nama_lengkap: pesananData.pesertas?.[idx]?.nama_lengkap ?? '',
                alamat: pesananData.pesertas?.[idx]?.alamat ?? '',
                telepon: pesananData.pesertas?.[idx]?.telepon ?? '',
                email: pesananData.pesertas?.[idx]?.email ?? '',
                foto_identitas: null,
                foto_paspor: null,
            }));
            setPeserta(initial);
        }
    }, [pesananData, pesertaCount]);

    const updateField = (index, field, value) => {
        setPeserta((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const formData = new FormData();
            peserta.forEach((item, idx) => {
                Object.entries(item).forEach(([key, val]) => {
                    if (val !== null && val !== undefined) {
                        formData.append(`peserta[${idx}][${key}]`, val);
                    }
                });
            });
            await api.post(`/pesanan/${id}/peserta`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/pesanan-saya');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan data peserta');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-slate-600">Memuat form peserta...</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Data Peserta</p>
                    <h1 className="text-3xl font-bold text-slate-900">Pesanan #{pesananData?.id}</h1>
                    <p className="text-slate-600">Jumlah peserta: {pesertaCount}</p>
                </div>
                <button
                    onClick={() => navigate('/pesanan-saya')}
                    className="text-sm text-indigo-700 font-semibold px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50"
                >
                    Kembali
                </button>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

            <form className="space-y-4" onSubmit={submit}>
                {peserta.map((item, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-slate-900">Peserta {idx + 1}</p>
                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">Wajib</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                                <input
                                    required
                                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={item.nama_lengkap}
                                    onChange={(e) => updateField(idx, 'nama_lengkap', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={item.email}
                                    onChange={(e) => updateField(idx, 'email', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Telepon</label>
                                <input
                                    required
                                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={item.telepon}
                                    onChange={(e) => updateField(idx, 'telepon', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Alamat</label>
                                <input
                                    required
                                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={item.alamat}
                                    onChange={(e) => updateField(idx, 'alamat', e.target.value)}
                                />
                            </div>
                            {wajibIdentitas && (
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Upload Identitas</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        onChange={(e) => updateField(idx, 'foto_identitas', e.target.files?.[0] ?? null)}
                                        className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 bg-white"
                                    />
                                </div>
                            )}
                            {wajibPaspor && (
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Upload Paspor</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        onChange={(e) => updateField(idx, 'foto_paspor', e.target.files?.[0] ?? null)}
                                        className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 bg-white"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <p className="text-sm text-slate-600">Pastikan data benar sebelum dikirim.</p>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {saving ? 'Menyimpan...' : 'Kirim Data'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormPesertaPage;
