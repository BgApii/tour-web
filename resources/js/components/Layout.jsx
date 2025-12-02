import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

function NavItem({ to, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive
                        ? 'text-indigo-700 bg-indigo-50 border border-indigo-100'
                        : 'text-slate-600 hover:text-indigo-700'
                }`
            }
        >
            {label}
        </NavLink>
    );
}

export default function Layout() {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isOwner = user?.role === 'owner';
    const isAdminOrOwner = isAdmin || isOwner;
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                            T
                        </span>
                        <div>
                            <p className="text-sm uppercase text-slate-500 tracking-[0.2em] font-semibold">
                                Tour
                            </p>
                            <p className="text-lg font-bold text-slate-900">Travel Planner</p>
                        </div>
                    </Link>
                    {!isLoginPage && (
                        <nav className="flex items-center gap-2">
                            {!isAdminOrOwner && <NavItem to="/" label="Katalog" />}
                            {user?.role === 'customer' && <NavItem to="/pesanan-saya" label="Pesanan Saya" />}
                            {isAdmin && (
                                <>
                                    <NavItem to="/admin/paket" label="Kelola Paket" />
                                    <NavItem to="/admin/pesanan" label="Kelola Pesanan" />
                                </>
                            )}
                            {isOwner && <NavItem to="/owner/rekapitulasi" label="Rekap" />}
                            {isAdminOrOwner && <NavItem to="/profil" label="Profil" />}
                        </nav>
                    )}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <div className="hidden sm:flex flex-col text-right">
                                    <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                                    <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 text-sm font-semibold text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className={`px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 ${isLoginPage ? 'hidden' : ''
                                    }`}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
