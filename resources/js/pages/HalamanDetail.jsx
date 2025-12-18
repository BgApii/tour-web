import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { formatTanggalIndo } from "../utils/date";
import { useAuth } from "../providers/AuthProvider";

const HalamanDetail = () => {
    const { id } = useParams();
    const { data: paket, loading, error } = useFetch(`/api/paket/${id}`);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === "owner") {
            navigate("/owner/rekapitulasi", { replace: true });
        } else if (user?.role === "admin") {
            navigate("/admin/paket", { replace: true });
        }
    }, [user, navigate]);

    if (loading)
        return <p className="text-slate-600">Memuat detail paket...</p>;
    if (error) return <p className="text-red-600">Gagal memuat paket</p>;
    if (!paket) return null;

    const banner =
        paket.banner_url || (paket.banner ? `/storage/${paket.banner}` : null);
    const destinasiList = (paket.destinasi || "")
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
    const includeList = (paket.include || "")
        .split(/\r?\n/)
        .map((d) => d.trim())
        .filter(Boolean);

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div
                    className="h-60 md:h-72 bg-slate-100"
                    style={
                        banner
                            ? {
                                backgroundImage: `url(${banner})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }
                            : {}
                    }
                >
                    {banner ? null : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200" />
                    )}
                </div>
                <div className="p-6 md:p-8 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-slate-900">
                                {paket.nama_paket}
                            </h1>
                            <p className="text-slate-600">{paket.destinasi}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Mulai dari</p>
                            <p className="text-2xl md:text-3xl font-bold text-indigo-700">
                                Rp{" "}
                                {Number(
                                    paket.harga_per_peserta ?? 0
                                ).toLocaleString("id-ID")}
                            </p>
                            <p className="text-xs text-slate-500">per pax</p>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Keberangkatan
                            </p>
                            <p className="text-lg font-semibold text-slate-900">
                                {formatTanggalIndo(paket.jadwal_keberangkatan)}
                            </p>
                        </div>
                        <div className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Durasi
                            </p>
                            <p className="text-lg font-semibold text-slate-900">
                                {paket.lama_hari != null &&
                                paket.lama_malam != null
                                    ? `${paket.lama_hari} Hari/${paket.lama_malam} Malam`
                                    : "-"}
                            </p>
                        </div>
                        <div className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Kuota
                            </p>
                            <p className="text-lg font-semibold text-slate-900">
                                {paket.kuota ?? "-"} peserta
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Destinasi & Itinerary
                            </h2>
                            <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                                Open Trip
                            </span>
                        </div>
                        <ul className="space-y-2 text-slate-700">
                            {destinasiList.length > 0 ? (
                                destinasiList.map((d, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span>{d}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-slate-500">
                                    Belum ada destinasi terdaftar.
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Persyaratan
                            </h3>
                            <ul className="space-y-2 text-slate-700">
                                <li className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span>
                                        Identitas:{" "}
                                        {paket.wajib_identitas
                                            ? "Wajib"
                                            : "Opsional"}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span>
                                        Paspor:{" "}
                                        {paket.wajib_paspor
                                            ? "Wajib"
                                            : "Opsional"}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Include
                            </h3>
                            <ul className="space-y-2 text-slate-700">
                                {includeList.length > 0 ? (
                                    includeList.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span>{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-slate-500">
                                        Belum ada daftar include.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                            to={`/paket/${paket.id}/pesan`}
                            className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
                        >
                            Pesan Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HalamanDetail;
