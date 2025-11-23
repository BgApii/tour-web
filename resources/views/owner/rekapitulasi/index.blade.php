<x-app-layout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Owner</p>
                <h1 class="text-2xl font-bold text-slate-900">Rekapitulasi Penjualan</h1>
                <p class="text-slate-600">Ringkasan performa paket tour dalam bentuk tabel dan chart.</p>
            </div>
        </div>

        @php
            $maxTotal = $rekap->max('total') ?: 1;
        @endphp

        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <p class="font-semibold text-slate-900">Tabel Penjualan</p>
                    <span class="text-sm text-slate-500">Total {{ $rekap->sum('total') }} pesanan</span>
                </div>
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <tr>
                            <th class="px-6 py-3">Paket</th>
                            <th class="px-6 py-3">Terjual</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @forelse($rekap as $item)
                            <tr class="hover:bg-slate-50/80">
                                <td class="px-6 py-4 font-semibold text-slate-900">{{ $item->paketTour->nama_paket ?? 'Paket' }}</td>
                                <td class="px-6 py-4 text-slate-700">{{ $item->total }} pesanan</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="2" class="px-6 py-8 text-center text-slate-500">Belum ada data penjualan.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <p class="font-semibold text-slate-900">Chart Penjualan</p>
                    <span class="text-xs text-slate-500">Representasi bar horizontal</span>
                </div>
                <div class="space-y-3">
                    @forelse($rekap as $item)
                        @php $width = ($item->total / $maxTotal) * 100; @endphp
                        <div>
                            <div class="flex items-center justify-between text-sm text-slate-700 mb-1">
                                <p class="font-semibold">{{ $item->paketTour->nama_paket ?? 'Paket' }}</p>
                                <span class="text-slate-500">{{ $item->total }} pesanan</span>
                            </div>
                            <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-indigo-500 to-sky-400" style="width: {{ $width }}%"></div>
                            </div>
                        </div>
                    @empty
                        <p class="text-sm text-slate-500">Belum ada data.</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
