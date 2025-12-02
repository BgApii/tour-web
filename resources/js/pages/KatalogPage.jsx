import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { formatTanggalIndo } from "../utils/date";
import { useAuth } from "../providers/AuthProvider";

const KatalogPage = () => {
    const { data: paket, loading, error } = useFetch("/api/paket");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === "owner") {
            navigate("/owner/rekapitulasi", { replace: true });
        } else if (user?.role === "admin") {
            navigate("/admin/paket", { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-900 text-white rounded-3xl p-10 shadow-xl">
                <div className="max-w-3xl space-y-3">
                    <p className="text-sm uppercase tracking-[0.2em] font-semibold text-indigo-100">
                        Halaman Katalog
                    </p>
                    <h1 className="text-4xl font-bold leading-tight">
                        Jelajahi paket tour pilihan kami
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        Pilih paket yang sesuai kebutuhanmu, cek detail
                        fasilitas, jadwal, dan lakukan pemesanan secara online.
                    </p>
                </div>
            </div>

            {loading && <p className="text-slate-600">Memuat paket...</p>}
            {error && <p className="text-red-600">Gagal memuat katalog</p>}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {(paket ?? []).map((item) => {
                    const banner = item.banner
                        ? `/storage/${item.banner}`
                        : null;
                    return (
                        <div
                            key={item.id}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition"
                        >
                            <div className="h-48 rounded-t-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 relative overflow-hidden">
                                <img
                                    src={banner}
                                    alt={item.nama_paket}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-sm">
                                    <span className="font-semibold">
                                        {item.nama_paket}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs">
                                        Kuota {item.kuota ?? "-"}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-semibold text-slate-900">
                                        {item.nama_paket}
                                    </p>
                                    <p className="text-sm font-semibold text-indigo-700">
                                        Rp{" "}
                                        {Number(
                                            item.harga_per_peserta ?? 0
                                        ).toLocaleString("id-ID")}{" "}
                                        <span className="text-slate-500 text-xs">
                                            /pax
                                        </span>
                                    </p>
                                </div>
                                <p className="text-sm text-slate-600">
                                    {item.destinasi}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                                    <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                                        Jadwal:{" "}
                                        {formatTanggalIndo(item.jadwal_keberangkatan)}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                                        Durasi:{" "}
                                        {item.durasi
                                            ? `${item.durasi} hari`
                                            : "-"}
                                    </span>
                                    {item.wajib_paspor && (
                                        <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                                            Wajib paspor
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <Link
                                        to={`/paket/${item.id}`}
                                        className="px-4 py-2 text-sm font-semibold text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                                    >
                                        Detail
                                    </Link>
                                    <Link
                                        to={`/paket/${item.id}/pesan`}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                    >
                                        Pesan
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KatalogPage;
