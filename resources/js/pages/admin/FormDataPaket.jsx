import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import useFetch from '../../hooks/useFetch';

export default function FormDataPaket() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { data: existing } = useFetch(isEdit ? `/admin/paket/${id}/edit` : null, {
        enabled: isEdit,
    });

    const [form, setForm] = useState({
        nama_paket: '',
        banner: null,
        destinasi: '',
        include: '',
        harga_per_peserta: '',
        jadwal_keberangkatan: '',
        kuota: '',
        lama_hari: '',
        lama_malam: '',
        wajib_paspor: false,
        wajib_identitas: false,
        tampil_di_katalog: true,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const formatDateInput = (value) => {
        if (!value) return '';
        const raw = String(value);
        if (raw.includes('T')) return raw.split('T')[0];
        if (raw.includes(' ')) return raw.split(' ')[0];
        return raw;
    };

    useEffect(() => {
        if (existing) {
            setForm((prev) => ({
                ...prev,
                ...existing,
                banner: null,
                tampil_di_katalog: Boolean(existing.tampil_di_katalog),
                wajib_paspor: Boolean(existing.wajib_paspor),
                wajib_identitas: Boolean(existing.wajib_identitas),
                lama_hari: existing.lama_hari ?? '',
                lama_malam: existing.lama_malam ?? '',
                jadwal_keberangkatan: formatDateInput(existing.jadwal_keberangkatan),
            }));
        }
    }, [existing]);

    const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        const requiredFields = [
            'nama_paket',
            'destinasi',
            'include',
            'harga_per_peserta',
            'jadwal_keberangkatan',
            'kuota',
            'lama_hari',
            'lama_malam',
        ];
        const hasEmptyRequired = requiredFields.some((field) => String(form[field] ?? '').trim() === '');
        if (hasEmptyRequired || (!isEdit && !form.banner)) {
            setError('Harap isi semua data');
            return;
        }
        setSaving(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value === null || value === undefined) return;
                if (key === 'banner') {
                    if (value instanceof File || value instanceof Blob) {
                        formData.append(key, value);
                    }
                    return;
                }
                formData.append(key, value);
            });
            if (isEdit) {
                formData.append('_method', 'PUT');
                await api.post(`/admin/paket/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await api.post('/admin/paket', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            const successMessage = isEdit ? 'Paket berhasil diperbarui' : 'Paket berhasil di tambah';
            navigate('/admin/paket', { state: { successMessage } });
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan paket');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-6 pb-10">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Form Data Paket</p>
                <h1 className="text-3xl font-bold text-slate-900">{isEdit ? 'Edit Paket' : 'Tambah Paket'}</h1>
                <p className="text-slate-600">Lengkapi informasi paket tour.</p>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

            <form className="bg-white border border-slate-200 rounded-3xl shadow p-6 space-y-4" onSubmit={submit}>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Nama Paket</label>
                        <input
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.nama_paket}
                            onChange={(e) => updateField('nama_paket', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Destinasi</label>
                        <input
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.destinasi}
                            onChange={(e) => updateField('destinasi', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Harga per Peserta</label>
                        <input
                            type="number"
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.harga_per_peserta}
                            onChange={(e) => updateField('harga_per_peserta', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Jadwal Keberangkatan</label>
                        <input
                            type="date"
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.jadwal_keberangkatan ?? ''}
                            onChange={(e) => updateField('jadwal_keberangkatan', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Kuota</label>
                        <input
                            type="number"
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.kuota}
                            onChange={(e) => updateField('kuota', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Lama (hari)</label>
                            <input
                                type="number"
                                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                value={form.lama_hari}
                                onChange={(e) => updateField('lama_hari', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Lama (malam)</label>
                            <input
                                type="number"
                                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                value={form.lama_malam}
                                onChange={(e) => updateField('lama_malam', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Include</label>
                        <textarea
                            rows={3}
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.include}
                            onChange={(e) => updateField('include', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Banner</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => updateField('banner', e.target.files?.[0] ?? null)}
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 bg-white"
                            required={!isEdit}
                        />
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {['wajib_paspor', 'wajib_identitas', 'tampil_di_katalog'].map((field) => (
                        <label key={field} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <input
                                type="checkbox"
                                checked={Boolean(form[field])}
                                onChange={(e) => updateField(field, e.target.checked)}
                                className="rounded border-slate-300 text-indigo-600"
                            />
                            {field === 'wajib_paspor' && 'Wajib paspor'}
                            {field === 'wajib_identitas' && 'Wajib identitas'}
                            {field === 'tampil_di_katalog' && 'Tampilkan di katalog'}
                        </label>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Paket'}
                    </button>
                </div>
            </form>
        </div>
    );
}
