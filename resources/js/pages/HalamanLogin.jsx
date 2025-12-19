import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export default function HalamanLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || '/';

    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await login(form);
            const loggedInUser = result?.user ?? result?.data ?? null;
            const role = loggedInUser?.role;
            if (role === 'owner') {
                navigate('/owner/rekapitulasi', { replace: true });
            } else if (role === 'admin') {
                navigate('/admin/paket', { replace: true });
            } else {
                navigate(redirectTo, { replace: true });
            }
        } catch (err) {
            setError('Email atau password tidak valid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-6 sm:py-8 lg:py-10">
            <div className="w-full max-w-sm mx-auto bg-white border border-slate-200 rounded-2xl shadow-lg p-5 sm:p-6 space-y-4">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-700"
                >
                    <span className="text-lg" aria-hidden="true">&larr;</span> Kembali ke Katalog
                </button>
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-semibold">Login</p>
                    <h1 className="text-xl font-bold text-slate-900">Masuk ke akunmu</h1>
                    <p className="text-sm text-slate-600">Gunakan email dan password yang sudah terdaftar.</p>
                </div>
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
                )}
                <form className="space-y-4" onSubmit={submit}>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Email</label>
                        <input
                            type="email"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Password</label>
                        <input
                            type="password"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                <div className="flex items-center gap-3">
                    <span className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs font-semibold text-slate-500">login google sebagai costumer</span>
                    <span className="flex-1 h-px bg-slate-200" />
                </div>

                <a
                    href="/auth/google/redirect"
                    className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <span className="h-5 w-5 flex items-center justify-center rounded-full bg-white shadow-inner text-indigo-600 font-bold">G</span>
                    <span>Lanjutkan dengan akun Google</span>
                </a>
            </div>
        </div>
    );
}
