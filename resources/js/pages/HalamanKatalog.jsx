import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { formatTanggalIndo } from "../utils/date";
import { useAuth } from "../providers/AuthProvider";

const HERO_IMAGE = "/images/hero.jpg";
const RATING_VISUAL =
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80";

const formatHarga = (value) =>
    `IDR ${Number(value ?? 0).toLocaleString("id-ID", {
        maximumFractionDigits: 0,
    })}`;

const HalamanKatalog = () => {
    const { data: paket, loading, error } = useFetch("/api/paket");
    const {
        data: ratings,
        loading: loadingRatings,
        error: errorRatings,
    } = useFetch("/api/ratings");
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

    const displayedPaket = useMemo(
        () => (paket ?? []).slice(0, visibleCount),
        [paket, visibleCount]
    );
    const hasMorePaket = (paket ?? []).length > visibleCount;
    const totalRatings = (ratings ?? []).length;
    const currentRating =
        totalRatings && totalRatings > 0
            ? ratings[(activeRatingIndex + totalRatings) % totalRatings]
            : null;

    const moveRating = (direction) => {
        if (!totalRatings) return;
        setActiveRatingIndex(
            (prev) => (prev + direction + totalRatings) % totalRatings
        );
    };

    return (
        <div className="space-y-16">
            <section
                id="hero-section"
                className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden pt-0"
            >
                <div className="absolute inset-0">
                    <img
                        src={HERO_IMAGE}
                        alt="Pegunungan"
                        className="h-full w-full object-cover"
                    />
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
                            Discover beautiful places around the world and
                            create unforgettable moments with your loved ones.
                        </p>
                    </div>
                </div>
            </section>

            <section id="paket-section" className="space-y-8">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
                        Katalog
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed mb-16">
                        Jelajahi beragam destinasi menakjubkan di seluruh dunia
                        dan rasakan pesona setiap musim yang memikat di setiap
                        langkah perjalanan Anda yang tak terlupakan dengan
                        Wishasi Tour and Travel Services!
                    </p>
                </div>

                {loading && (
                    <p className="text-slate-600 text-center">
                        Memuat katalog paket...
                    </p>
                )}
                {error && (
                    <p className="text-center text-red-600 text-sm">
                        Gagal memuat katalog. Silakan coba beberapa saat lagi.
                    </p>
                )}

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="
            grid
            justify-center
            gap-x-6 gap-y-6
            [grid-template-columns:repeat(auto-fill,300px)]
        "
                    >
                        {displayedPaket.map((item) => {
                            const banner = item.banner
                                ? `/storage/${item.banner}`
                                : null;
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
                                    className="flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition"
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
                                        <Link
                                            to={`/paket/${item.id}`}
                                            className="block text-lg font-semibold text-slate-900 leading-tight mb-4 hover:text-purple-700 transition"
                                        >
                                            {item.nama_paket}
                                        </Link>
                                        <div className="space-y-2 text-sm text-slate-700">
                                            <div className="flex items-start gap-2">
                                                <span
                                                    aria-hidden
                                                    className="mt-0.5 text-purple-700"
                                                >
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
                                                <span className="leading-snug">
                                                    {item.destinasi ||
                                                        "Lokasi belum tersedia"}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span
                                                    aria-hidden
                                                    className="mt-0.5 text-purple-700"
                                                >
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
                                                            d="M3 12h18m-9 9V3"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="font-semibold text-slate-800">
                                                    {durasi}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span
                                                    aria-hidden
                                                    className="mt-0.5 text-purple-700"
                                                >
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
                                                    <p className="font-semibold text-slate-900">
                                                        Keberangkatan
                                                    </p>
                                                    {keberangkatan.length >
                                                    0 ? (
                                                        keberangkatan.map(
                                                            (tgl) => (
                                                                <p
                                                                    key={tgl}
                                                                    className="text-slate-600"
                                                                >
                                                                    {tgl}
                                                                </p>
                                                            )
                                                        )
                                                    ) : (
                                                        <p className="text-slate-500">
                                                            Jadwal belum
                                                            tersedia
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Mulai dari
                                            </p>
                                            <p className="text-base font-bold text-purple-700">
                                                {formatHarga(
                                                    item.harga_per_peserta
                                                )}
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
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {!loading && !error && displayedPaket.length === 0 && (
                    <p className="text-slate-600 text-center text-sm">
                        Belum ada paket tour yang ditampilkan.
                    </p>
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

            <section id="rating-section" className="space-y-3">
                <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                    <div className="flex flex-col gap-4">
                        <div className="space-y-1">
                            <p className="text-2xl sm:text-3xl font-semibold text-purple-700 mb-4 italic">
                                Rating
                            </p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                Trusted By Our Customers
                            </h2>
                        </div>

                        {loadingRatings && (
                            <p className="text-slate-600">Memuat rating...</p>
                        )}
                        {errorRatings && (
                            <p className="text-red-600 text-sm">
                                Gagal memuat rating. Coba lagi nanti.
                            </p>
                        )}

                        {currentRating && (
                            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 space-y-4">
                                <p className="text-lg font-semibold text-slate-900">
                                    {currentRating.user?.name ?? "Traveler"}
                                </p>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    “
                                    {currentRating.ulasan ||
                                        "Tanpa ulasan tertulis"}
                                    ”
                                </p>
                                <div className="flex items-center gap-2 text-amber-500">
                                    {Array.from({ length: 5 }).map((_, idx) => {
                                        const filled =
                                            idx + 1 <=
                                            Math.round(
                                                Number(
                                                    currentRating.nilai_rating
                                                ) || 0
                                            );
                                        return (
                                            <svg
                                                key={idx}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill={
                                                    filled
                                                        ? "currentColor"
                                                        : "none"
                                                }
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
                                </div>
                            </div>
                        )}

                        {!loadingRatings && !currentRating && (
                            <p className="text-slate-600 text-sm">
                                Belum ada rating yang ditampilkan.
                            </p>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {totalRatings > 0 &&
                                    ratings.map((rating, idx) => {
                                        const isActive =
                                            idx ===
                                            (activeRatingIndex + totalRatings) %
                                                totalRatings;
                                        return (
                                            <button
                                                key={rating.id ?? idx}
                                                onClick={() =>
                                                    setActiveRatingIndex(idx)
                                                }
                                                className={`h-2.5 w-2.5 rounded-full transition ${
                                                    isActive
                                                        ? "bg-purple-700"
                                                        : "bg-slate-300"
                                                }`}
                                                aria-label={`Pilih rating ${
                                                    idx + 1
                                                }`}
                                            />
                                        );
                                    })}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => moveRating(-1)}
                                    className="h-9 w-9 rounded-full border border-slate-200 text-slate-700 hover:border-purple-200 hover:text-purple-700 transition flex items-center justify-center"
                                    aria-label="Sebelumnya"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 5l-7 7 7 7"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => moveRating(1)}
                                    className="h-9 w-9 rounded-full border border-slate-200 text-slate-700 hover:border-purple-200 hover:text-purple-700 transition flex items-center justify-center"
                                    aria-label="Berikutnya"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
                        <img
                            src="/images/rating.png"
                            alt="Kepuasan pelanggan"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            <section
                id="contact-section"
                className="relative -mx-4 sm:-mx-6 lg:-mx-8 bg-[#1f0235] text-white"
            >
                <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-12 sm:py-14">
                    <div className="grid md:grid-cols-3 gap-10 items-start">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-8">
                                <img
                                    src="/images/logo.png"
                                    alt="Wishasi"
                                    className="h-12 w-12 object-contain"
                                />
                                <div className="leading-tight">
                                    <p className="text-xl font-bold text-purple-100">
                                        Wishasi
                                    </p>
                                    <p className="text-sm text-purple-100">
                                        Tour and Travel
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-purple-100 leading-relaxed max-w-xs">
                                Kami hadir untuk membantu merencanakan
                                perjalanan terbaik Anda, mulai dari konsultasi
                                hingga pendampingan penuh selama tour
                                berlangsung.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-lg font-semibold">Call Us</p>
                                <a
                                    href="tel:088742877304"
                                    className="text-sm text-purple-100 hover:text-white transition"
                                >
                                    0887 4287 7304
                                </a>
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-semibold">
                                    Email Us
                                </p>
                                <a
                                    href="mailto:wishasitrv191@gmail.com"
                                    className="text-sm text-purple-100 hover:text-white transition"
                                >
                                    wishasitrv191@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-lg font-semibold">Follow Us</p>
                            <div className="flex items-center gap-4">
                                <a
                                    href="https://instagram.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="h-11 w-11 rounded-full bg-purple-800 text-white flex items-center justify-center hover:bg-purple-700 transition"
                                    aria-label="Instagram"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill="#d8d8d8"
                                            d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                                        />
                                    </svg>
                                </a>
                                <a
                                    href="https://tiktok.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="h-11 w-11 rounded-full bg-purple-800 text-white flex items-center justify-center hover:bg-purple-700 transition"
                                    aria-label="Tiktok"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                        className="text-white"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-purple-800 pt-4 text-center text-xs text-purple-200">
                        © 2025 Wishasi Tour and Travel. All Rights Reserved.
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HalamanKatalog;
