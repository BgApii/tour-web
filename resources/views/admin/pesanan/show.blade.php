<x-app-layout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Admin • Detail Pesanan</p>
                <h1 class="text-2xl font-bold text-slate-900">Pesanan #{{ $pesanan->id }}</h1>
                <p class="text-slate-600">Paket {{ $pesanan->paketTour->nama_paket ?? 'Paket' }} · {{ $pesanan->jumlah_peserta }} peserta</p>
            </div>
            <a href="{{ route('admin.pesanan.index') }}" class="text-sm text-indigo-700 font-semibold">Kembali</a>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
            <div class="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                <p class="text-xs text-slate-500 uppercase">Customer</p>
                <p class="font-semibold text-slate-900">{{ $pesanan->user->name ?? '-' }}</p>
                <p class="text-sm text-slate-600">{{ $pesanan->user->email ?? '-' }}</p>
            </div>
            <div class="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                <p class="text-xs text-slate-500 uppercase">Status</p>
                <p class="font-semibold text-slate-900">{{ ucfirst(str_replace('_',' ', $pesanan->status_pesanan)) }}</p>
                <p class="text-sm text-slate-600">Tanggal: {{ $pesanan->tanggal_pemesanan ?? 'TBD' }}</p>
            </div>
            <div class="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                <p class="text-xs text-slate-500 uppercase">Harga</p>
                <p class="font-semibold text-slate-900">Rp {{ number_format($pesanan->paketTour->harga_per_peserta ?? 0,2,',','.') }} x {{ $pesanan->jumlah_peserta }}</p>
                <p class="text-sm text-slate-600">Estimasi total: Rp {{ number_format(($pesanan->paketTour->harga_per_peserta ?? 0) * $pesanan->jumlah_peserta,2,',','.') }}</p>
            </div>
        </div>

        <div class="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div class="px-6 py-4 flex items-center justify-between">
                <div>
                    <p class="text-sm font-semibold text-slate-900">Daftar Peserta</p>
                    <p class="text-sm text-slate-600">Verifikasi identitas setiap peserta.</p>
                </div>
            </div>
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <tr>
                        <th class="px-6 py-3">Nama</th>
                        <th class="px-6 py-3">Kontak</th>
                        <th class="px-6 py-3">Identitas</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3 text-right">Verifikasi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($pesanan->pesertas as $peserta)
                        <tr class="hover:bg-slate-50/80">
                            <td class="px-6 py-4">
                                <p class="font-semibold text-slate-900">{{ $peserta->nama_lengkap }}</p>
                                <p class="text-sm text-slate-500">{{ $peserta->alamat }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-sm text-slate-700">{{ $peserta->email }}</p>
                                <p class="text-sm text-slate-500">{{ $peserta->telepon }}</p>
                            </td>
                            <td class="px-6 py-4 text-sm text-slate-700">
                                <p>ID: {{ $peserta->foto_identitas ?? '-' }}</p>
                                <p>Paspor: {{ $peserta->paspor ?? '-' }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-full text-xs font-semibold
                                    @if($peserta->status_verifikasi === 'diverifikasi') bg-emerald-100 text-emerald-800
                                    @elseif($peserta->status_verifikasi === 'ditolak') bg-red-100 text-red-800
                                    @else bg-amber-100 text-amber-800 @endif">
                                    {{ $peserta->status_verifikasi }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <form method="POST" action="{{ route('admin.peserta.verify', $peserta->id) }}" class="inline">
                                    @csrf
                                    @method('PUT')
                                    <button class="px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100">Verify</button>
                                </form>
                                <form method="POST" action="{{ route('admin.peserta.reject', $peserta->id) }}" class="inline">
                                    @csrf
                                    @method('PUT')
                                    <button class="px-3 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100">Reject</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-slate-500">Belum ada data peserta.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-app-layout>
