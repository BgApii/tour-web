<x-app-layout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <p class="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Admin • Pesanan</p>
                <h1 class="text-2xl font-bold text-slate-900">Daftar semua pesanan</h1>
                <p class="text-slate-600">Pantau status, hubungi customer, dan verifikasi peserta.</p>
            </div>
        </div>

        <div class="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <tr>
                        <th class="px-6 py-3">Pesanan</th>
                        <th class="px-6 py-3">Customer</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3">Jumlah</th>
                        <th class="px-6 py-3 text-right">Detail</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($pesanan as $item)
                        <tr class="hover:bg-slate-50/80">
                            <td class="px-6 py-4">
                                <p class="font-semibold text-slate-900">#{{ $item->id }} - {{ $item->paketTour->nama_paket ?? 'Paket' }}</p>
                                <p class="text-sm text-slate-500">Tanggal: {{ $item->tanggal_pemesanan ?? 'TBD' }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <p class="font-semibold text-slate-800">{{ $item->user->name ?? '-' }}</p>
                                <p class="text-sm text-slate-500">{{ $item->user->email ?? '-' }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">{{ str_replace('_',' ', $item->status_pesanan) }}</span>
                            </td>
                            <td class="px-6 py-4 text-sm text-slate-700">{{ $item->jumlah_peserta }} peserta</td>
                            <td class="px-6 py-4 text-right">
                                <a href="{{ route('admin.pesanan.show', $item->id) }}" class="px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100">Lihat</a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-slate-500">Belum ada pesanan.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-app-layout>
