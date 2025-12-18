import React, { useEffect, useState } from 'react';
import api from '../lib/api';

const MenuProfil = () => {
    const [form, setForm] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await api.get('/profile');
                const user = response.data.data ?? response.data?.user ?? null;
                if (user) {
                    setForm({ name: user.name ?? '', email: user.email ?? '' });
                }
            } catch (err) {
                setError('Gagal memuat profil');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        setError(null);
        try {
            const response = await api.patch('/profile', form);
            setMessage(response.data.message ?? 'Profil diperbarui');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui profil');
        } finally {
            setSaving(false);
        }
    };

    const submitPassword = async (e) => {
        e.preventDefault();
        setPasswordSaving(true);
        setPasswordMessage(null);
        setPasswordError(null);
        try {
            const response = await api.put('/password', passwordForm);
            setPasswordMessage(response.data.message ?? 'Password diperbarui');
            setPasswordForm({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Gagal memperbarui password');
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) return <p className="text-slate-600">Memuat profil...</p>;

    return (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow p-8 space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Halaman Profile</p>
                <h1 className="text-3xl font-bold text-slate-900">Perbarui informasi akun</h1>
            </div>
            {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">{message}</div>}
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
            <div className="grid gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Nama</label>
                        <input
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            disabled
                        />
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                    <p className="text-lg font-semibold text-slate-900 mb-2">Ubah Password</p>
                    {passwordMessage && (
                        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-3">
                            {passwordMessage}
                        </div>
                    )}
                    {passwordError && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-3">
                            {passwordError}
                        </div>
                    )}
                    <form className="space-y-4" onSubmit={submitPassword}>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Password Lama</label>
                            <input
                                type="password"
                                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                value={passwordForm.current_password}
                                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Password Baru</label>
                            <input
                                type="password"
                                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                value={passwordForm.password}
                                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                value={passwordForm.password_confirmation}
                                onChange={(e) =>
                                    setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })
                                }
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={passwordSaving}
                            className="px-4 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-60"
                        >
                            {passwordSaving ? 'Memproses...' : 'Ubah Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MenuProfil;
