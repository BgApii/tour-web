import React, { useMemo, useState } from 'react';
import useFetch from '../../hooks/useFetch';

export default function HalamanRekapitulasi() {
    const [draftFilters, setDraftFilters] = useState({ bulan: '', tahun: '' });
    const [appliedFilters, setAppliedFilters] = useState({ bulan: '', tahun: '' });
    const query = useMemo(() => {
        const params = new URLSearchParams();
        if (appliedFilters.bulan) params.set('bulan', appliedFilters.bulan);
        if (appliedFilters.tahun) params.set('tahun', appliedFilters.tahun);
        const qs = params.toString();
        return qs ? `/owner/rekapitulasi?${qs}` : '/owner/rekapitulasi';
    }, [appliedFilters]);

    const { data: rekap, loading, error, refetch } = useFetch(query);

    const bulanOptions = [
        { value: '', label: 'Semua bulan' },
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' },
    ];

    const rows = useMemo(
        () =>
            (rekap ?? []).flatMap((row) =>
                (row.pesanan ?? []).map((item) => ({
                    paket: row.paket?.nama_paket,
                    customer: item.customer ?? '-',
                    jumlah_peserta: item.jumlah_peserta ?? 0,
                    harga: item.harga ?? 0,
                }))
            ),
        [rekap]
    );

    const totalPendapatan = useMemo(
        () => rows.reduce((sum, item) => sum + Number(item.harga ?? 0) * Number(item.jumlah_peserta ?? 0), 0),
        [rows]
    );

    const getJudul = () => {
        const bulanLabel = bulanOptions.find((b) => String(b.value) === String(appliedFilters.bulan))?.label ?? '';
        if (!appliedFilters.bulan && !appliedFilters.tahun) return 'Rekapitulasi Penjualan';
        if (!appliedFilters.bulan && appliedFilters.tahun) return `Rekapitulasi Penjualan Tahun ${appliedFilters.tahun}`;
        return `Rekapitulasi Penjualan Bulan ${bulanLabel} Tahun ${appliedFilters.tahun || '-'}`;
    };

    const handlePrint = () => {
        const judul = getJudul();
        const win = window.open('', '_blank');
        if (!win) return;
        const rowsHtml = rows
            .map(
                (item) => `
            <tr>
                <td style="padding:8px;border:1px solid #e2e8f0;">${item.paket ?? '-'}</td>
                <td style="padding:8px;border:1px solid #e2e8f0;">${item.customer}</td>
                <td style="padding:8px;border:1px solid #e2e8f0; text-align:center;">${item.jumlah_peserta}</td>
                <td style="padding:8px;border:1px solid #e2e8f0; text-align:right;">Rp ${Number(item.harga ?? 0).toLocaleString('id-ID')}</td>
            </tr>
        `
            )
            .join('');

        win.document.write(`
            <html>
                <head>
                    <title>${judul}</title>
                    <style>
                        body { font-family: Arial, sans-serif; color:#0f172a; padding:24px; }
                        h1 { margin: 4px 0; font-size: 20px; }
                        table { border-collapse: collapse; width: 100%; margin-top: 16px; }
                        th { text-align: left; padding:8px; border:1px solid #e2e8f0; background:#f8fafc; }
                    </style>
                </head>
                <body>
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <div style="height:48px; width:48px; background:#4f46e5; color:white; display:flex; align-items:center; justify-content:center; border-radius:12px; font-weight:700;">T</div>
                        <div>
                            <div style="font-weight:700; font-size:16px;">Travel Planner</div>
                            <div style="color:#475569; font-size:13px;">Rekapitulasi Penjualan</div>
                        </div>
                    </div>
                    <h1>${judul}</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Paket</th>
                                <th>Customer</th>
                                <th>Jumlah Peserta</th>
                                <th>Harga</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml || '<tr><td colspan="4" style="padding:12px; text-align:center; color:#94a3b8;">Tidak ada data</td></tr>'}
                        </tbody>
                    </table>
                    <div style="margin-top:16px; font-weight:700;">Total Pendapatan: Rp ${Number(totalPendapatan).toLocaleString('id-ID')}</div>
                    <script>window.onload = function(){ window.print(); window.close(); };</script>
                </body>
            </html>
        `);
        win.document.close();
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 font-semibold">Halaman Rekapitulasi</p>
                <h1 className="text-3xl font-bold text-slate-900">Ringkasan pemesanan per paket</h1>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1">
                    <label className="text-sm font-semibold text-slate-700">Bulan</label>
                    <select
                        className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        value={draftFilters.bulan}
                        onChange={(e) => setDraftFilters((prev) => ({ ...prev, bulan: e.target.value }))}
                    >
                        {bulanOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-sm font-semibold text-slate-700">Tahun</label>
                    <input
                        type="number"
                        placeholder="cth: 2024"
                        className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        value={draftFilters.tahun}
                        onChange={(e) => setDraftFilters((prev) => ({ ...prev, tahun: e.target.value }))}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAppliedFilters(draftFilters)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                    >
                        Terapkan
                    </button>
                    <button
                        onClick={() => {
                            setDraftFilters({ bulan: '', tahun: '' });
                            setAppliedFilters({ bulan: '', tahun: '' });
                        }}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                    >
                        Cetak Rekap
                    </button>
                </div>
            </div>

            {loading && <p className="text-slate-600">Memuat rekap...</p>}
            {error && <p className="text-red-600">Gagal memuat data</p>}

            <div className="bg-white border border-slate-200 rounded-2xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3">Paket</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Jumlah Peserta</th>
                            <th className="px-6 py-3">Harga</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-900">{item.paket}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">{item.customer}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{item.jumlah_peserta}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">
                                    Rp {Number(item.harga ?? 0).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                        {!loading && (rekap ?? []).length === 0 && (
                            <tr>
                                <td className="px-6 py-6 text-center text-slate-500" colSpan={4}>
                                    Belum ada data.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-end text-sm text-slate-700">
                <span className="font-semibold mr-2">Total Pendapatan:</span>
                <span>Rp {Number(totalPendapatan).toLocaleString('id-ID')}</span>
            </div>
        </div>
    );
}
