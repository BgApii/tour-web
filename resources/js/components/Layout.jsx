import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

function NavItem({ to, label, end = false }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'text-purple-700' : 'text-slate-700 hover:text-purple-700'
                }`
            }
        >
            {label}
        </NavLink>
    );
}

function AnchorNavItem({ label, hash, isActive, onClick }) {
    return (
        <Link
            to={`/#${hash}`}
            onClick={(e) => onClick?.(e, hash)}
            className={`px-3 py-2 text-sm font-semibold transition ${
                isActive ? 'text-purple-700' : 'text-slate-700 hover:text-purple-700'
            }`}
        >
            {label}
        </Link>
    );
}

export default function Layout() {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isOwner = user?.role === 'owner';
    const isAdminOrOwner = isAdmin || isOwner;
    const isCustomer = user?.role === 'customer';
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    const customerAnchorLinks = [
        { hash: 'paket-section', label: 'Katalog' },
        { hash: 'rating-section', label: 'Rating' },
        { hash: 'contact-section', label: 'Contact Us' },
    ];

    const scrollToSection = (hash) => {
        const id = hash.replace('#', '');
        const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleAnchorClick = (e, hash) => {
        if (location.pathname === '/') {
            e.preventDefault();
            const targetHash = `#${hash}`;
            if (window.location.hash !== targetHash) {
                window.history.pushState(null, '', targetHash);
            }
            scrollToSection(hash);
        }
    };

    useEffect(() => {
        if (location.pathname !== '/' || !location.hash) return;
        scrollToSection(location.hash);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, location.hash]);

    const isHashActive = (hash) => {
        if (location.pathname !== '/') return false;
        return location.hash === `#${hash}`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setOpenUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Wishasi" className="h-12 w-12 object-contain" />
                    </Link>

                    {!isLoginPage && (
                        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8">
                            {!isAdminOrOwner && (
                                <>
                                    <NavItem to="/" label="Home" end />
                                    {customerAnchorLinks.map((link) => (
                                    <AnchorNavItem
                                        key={link.hash}
                                        hash={link.hash}
                                        label={link.label}
                                        isActive={isHashActive(link.hash)}
                                        onClick={handleAnchorClick}
                                    />
                                    ))}
                                </>
                            )}
                            {isCustomer && <NavItem to="/pesanan-saya" label="Pesanan Saya" />}
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

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setOpenUserMenu((prev) => !prev)}
                                    className="flex items-center gap-2 text-left"
                                >
                                    <div className="hidden sm:flex flex-col text-right">
                                        <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                                        <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-slate-600"
                                    >
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </button>
                                {openUserMenu && (
                                    <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 bg-white shadow-md">
                                        <button
                                            onClick={() => {
                                                setOpenUserMenu(false);
                                                logout();
                                            }}
                                            className="w-full px-4 py-2 text-sm text-left text-slate-700 hover:bg-slate-50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            !isLoginPage && (
                                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-purple-700">
                                    Login
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <Outlet />
            </main>
        </div>
    );
}
