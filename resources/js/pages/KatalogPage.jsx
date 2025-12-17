import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { formatTanggalIndo } from "../utils/date";
import { useAuth } from "../providers/AuthProvider";

const HERO_IMAGE = "/images/hero.jpg";
const RATING_VISUAL =
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80";

const formatHarga = (value) =>
    `IDR ${Number(value ?? 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

const KatalogPage = () => {
    const { data: paket, loading, error } = useFetch("/api/paket");
    const { data: ratings, loading: loadingRatings, error: errorRatings } = useFetch("/api/ratings");
    const { user } = useAuth();
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(12);
    const [activeRatingIndex, setActiveRatingIndex] = useState(0);

    useEffect(() => {
        if (user?.role === "owner") {
            navigate("/owner/rekapitulasi", { replace: true });
        } else if (user?.role === "admin") {
            navigate("/admin/paket", { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        setVisibleCount(12);
    }, [paket]);

    useEffect(() => {
        setActiveRatingIndex(0);
    }, [ratings]);

    const displayedPaket = useMemo(() => (paket ?? []).slice(0, visibleCount), [paket, visibleCount]);
    const hasMorePaket = (paket ?? []).length > visibleCount;
    const totalRatings = (ratings ?? []).length;
    const currentRating =
        totalRatings && totalRatings > 0 ? ratings[(activeRatingIndex + totalRatings) % totalRatings] : null;

    const moveRating = (direction) => {
        if (!totalRatings) return;
        setActiveRatingIndex((prev) => (prev + direction + totalRatings) % totalRatings);
    };

    return (
        <div className="space-y-16">
            <section id="hero-section" className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden pt-0">
                <div className="absolute inset-0">
                    <img src={HERO_IMAGE} alt="Pegunungan" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/25" />
                </div>
                <div className="relative max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-32 sm:py-40 lg:py-48 text-center text-white space-y-6">
                    <div className="space-y-3">
                        <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-purple-100/90">
                            Welcome To Wishasi Travel Services
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                            Let&apos;s Explore The World
                        </h1>
                        <p className="text-base sm:text-lg text-purple-50 max-w-3xl mx-auto leading-relaxed">
                            Discover beautiful places around the world and create unforgettable moments with your
                            loved ones.
                        </p>
                    </div>
                </div>
            </section>

            <section id="paket-section" className="space-y-8">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Katalog</h2>
                    <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Jelajahi beragam destinasi menakjubkan di seluruh dunia dan rasakan pesona setiap musim yang memikat di setiap langkah perjalanan Anda yang tak terlupakan dengan Wishasi Tour and Travel Services!
                    </p>
                </div>

                {loading && <p className="text-slate-600 text-center">Memuat katalog paket...</p>}
                {error && (
                    <p className="text-center text-red-600 text-sm">
                        Gagal memuat katalog. Silakan coba beberapa saat lagi.
                    </p>
                )}

                <div className="grid gap-x-1 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                    {displayedPaket.map((item) => {
                        const banner = item.banner ? `/storage/${item.banner}` : null;
                        const durasi =
                            item.lama_hari && item.lama_malam
                                ? `${item.lama_hari}D/${item.lama_malam}N`
                                : item.lama_hari
                                    ? `${item.lama_hari} Hari`
                                    : "-";
                        const keberangkatan = item.jadwal_keberangkatan
                            ? [formatTanggalIndo(item.jadwal_keberangkatan)]
                            : [];
                        return (
                            <div
                                key={item.id}
                                className="w-full max-w-[320px] flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition"
                            >
                                <div className="relative h-44 sm:h-48 bg-gradient-to-br from-purple-100 to-amber-50">
                                    {banner ? (
                                        <img
                                            src={banner}
                                            alt={item.nama_paket}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-full w-full" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
                                </div>
                                <div className="flex-1 p-5 space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                                            {item.nama_paket}
                                        </h3>
                                        <p
                                            className="text-sm text-slate-600 overflow-hidden"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                            }}
                                        >
                                            {item.destinasi || "Destinasi belum tersedia"}
                                        </p>
                                    </div>
                                    <div className="space-y-2 text-sm text-slate-700">
                                        <div className="flex items-start gap-2">
                                            <span aria-hidden className="mt-0.5 text-purple-700">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.8"
                                                    stroke="currentColor"
                                                    className="h-5 w-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19.5 9.5c0 7-7.5 11-7.5 11S4.5 16.5 4.5 9.5a7.5 7.5 0 1 1 15 0Z"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="leading-snug">{item.destinasi || "Lokasi belum tersedia"}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span aria-hidden className="mt-0.5 text-purple-700">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.8"
                                                    stroke="currentColor"
                                                    className="h-5 w-5"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18m-9 9V3" />
                                                </svg>
                                            </span>
                                            <span className="font-semibold text-slate-800">{durasi}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span aria-hidden className="mt-0.5 text-purple-700">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.8"
                                                    stroke="currentColor"
                                                    className="h-5 w-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
                                                    />
                                                </svg>
                                            </span>
                                            <div className="space-y-1 leading-snug">
                                                <p className="font-semibold text-slate-900">Keberangkatan</p>
                                                {keberangkatan.length > 0 ? (
                                                    keberangkatan.map((tgl) => (
                                                        <p key={tgl} className="text-slate-600">
                                                            {tgl}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p className="text-slate-500">Jadwal belum tersedia</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
                                    <div>
                                        <p className="text-xs text-slate-500">Mulai dari</p>
                                        <p className="text-base font-bold text-purple-700">
                                            {formatHarga(item.harga_per_peserta)}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/paket/${item.id}`}
                                        className="text-sm font-semibold text-purple-700 flex items-center gap-1 hover:text-purple-800"
                                    >
                                        Details
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="h-4 w-4"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!loading && !error && displayedPaket.length === 0 && (
                    <p className="text-slate-600 text-center text-sm">Belum ada paket tour yang ditampilkan.</p>
                )}

                {hasMorePaket && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setVisibleCount((prev) => prev + 8)}
                            className="px-6 py-3 text-sm font-semibold text-white bg-purple-700 rounded-full shadow-md hover:bg-purple-800 transition"
                        >
                            Muat paket lain
                        </button>
                    </div>
                )}
            </section>

            <section id="rating-section" className="space-y-8">
                <div className="text-center space-y-3">
                    <p className="text-base font-semibold text-purple-700">Rating</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Trusted By Our Customers</h2>
                    <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Dengarkan pengalaman para traveler setelah menjelajah bersama Wishasi Tour and Travel.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                    <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-6 sm:p-8 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-purple-700 font-semibold">Rating</p>
                                <p className="text-2xl font-bold text-slate-900">Suara Pelanggan</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => moveRating(-1)}
                                    className="h-10 w-10 rounded-full border border-slate-200 text-slate-700 hover:border-purple-200 hover:text-purple-700 transition"
                                    aria-label="Sebelumnya"
                                >
                                    <span aria-hidden>&lt;</span>
                                </button>
                                <button
                                    onClick={() => moveRating(1)}
                                    className="h-10 w-10 rounded-full border border-slate-200 text-slate-700 hover:border-purple-200 hover:text-purple-700 transition"
                                    aria-label="Berikutnya"
                                >
                                    <span aria-hidden>&gt;</span>
                                </button>
                            </div>
                        </div>

                        {loadingRatings && <p className="text-slate-600 mt-6">Memuat rating...</p>}
                        {errorRatings && (
                            <p className="text-red-600 mt-6 text-sm">Gagal memuat rating. Coba lagi nanti.</p>
                        )}

                        {currentRating && (
                            <div className="mt-6 space-y-4">
                                <p className="text-lg font-semibold text-slate-900">{currentRating.user?.name ?? "Traveler"}</p>
                                <p className="text-sm text-slate-600 leading-relaxed">"{currentRating.ulasan || "Tanpa ulasan tertulis"}"</p>
                                <div className="flex items-center gap-2 text-amber-500">
                                    {Array.from({ length: 5 }).map((_, idx) => {
                                        const filled = idx + 1 <= Math.round(Number(currentRating.nilai_rating) || 0);
                                        return (
                                            <svg
                                                key={idx}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill={filled ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                strokeWidth="1.4"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.062 4.178a.563.563 0 0 0 .424.307l4.615.67c.499.073.698.686.337 1.037l-3.338 3.255a.563.563 0 0 0-.162.498l.788 4.592a.563.563 0 0 1-.816.593l-4.122-2.168a.563.563 0 0 0-.524 0l-4.122 2.168a.563.563 0 0 1-.816-.593l.788-4.592a.563.563 0 0 0-.162-.498l-3.338-3.255a.563.563 0 0 1 .337-1.037l4.615-.67a.563.563 0 0 0 .424-.307l2.062-4.178Z"
                                                />
                                            </svg>
                                        );
                                    })}
                                    <span className="text-sm text-slate-600 ml-2">
                                        {currentRating.nilai_rating}/5 - {currentRating.paket?.nama_paket ?? "Paket"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {!loadingRatings && !currentRating && (
                            <p className="text-slate-600 mt-6 text-sm">Belum ada rating yang ditampilkan.</p>
                        )}

                        {totalRatings > 1 && (
                            <div className="mt-6 flex items-center gap-2">
                                {ratings.map((rating, idx) => {
                                    const isActive = idx === (activeRatingIndex + totalRatings) % totalRatings;
                                    return (
                                        <button
                                            key={rating.id ?? idx}
                                            onClick={() => setActiveRatingIndex(idx)}
                                            className={`h-2.5 rounded-full transition ${isActive ? "w-6 bg-purple-700" : "w-2.5 bg-slate-300"}`}
                                            aria-label={`Pilih rating ${idx + 1}`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-white to-amber-50 border border-slate-100">
                        <img src={RATING_VISUAL} alt="Kepuasan pelanggan" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-purple-900/10 to-transparent" />
                    </div>
                </div>
            </section>

            <section
                id="contact-section"
                className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden rounded-3xl bg-purple-900 text-white"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_35%)]" />
                <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-12 sm:py-14">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                        <div className="space-y-3 max-w-lg">
                            <h3 className="text-2xl font-bold">Wishasi Tour and Travel</h3>
                            <p className="text-purple-100 leading-relaxed">
                                Kami hadir untuk membantu merencanakan perjalanan terbaik Anda, mulai dari konsultasi
                                hingga pendampingan penuh selama tour berlangsung.
                            </p>
                            <p className="text-sm text-purple-200">(c) 2023 Bayu Buana Travel Services. All Rights Reserved.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 flex-1 w-full">
                            <div className="space-y-3">
                                <p className="text-sm uppercase tracking-[0.2em] text-purple-200">Call Us</p>
                                <p className="text-lg font-semibold">(021) 2350 9999</p>
                                <p className="text-sm uppercase tracking-[0.2em] text-purple-200 pt-2">Email Us</p>
                                <p className="text-lg font-semibold">marketing@bayubuanatravel.com</p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm uppercase tracking-[0.2em] text-purple-200">Follow Us</p>
                                <div className="flex items-center gap-3">
                                    {["facebook", "instagram", "x", "youtube"].map((network) => (
                                        <span
                                            key={network}
                                            className="h-10 w-10 rounded-full bg-purple-800 text-purple-50 flex items-center justify-center font-semibold uppercase"
                                        >
                                            {network[0]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default KatalogPage;
