<x-app-layout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div class="bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-700 text-white rounded-2xl p-8 shadow-lg">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p class="text-sm uppercase tracking-wide text-indigo-100 font-semibold">Pesanan Saya</p>
                    <h1 class="text-3xl font-bold">Pantau status perjalananmu</h1>
                    <p class="text-indigo-100 mt-2">Kelola pemesanan, isi data peserta, dan berikan rating setelah perjalanan selesai.</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="px-4 py-3 bg-white/10 rounded-xl">
                        <p class="text-xs text-indigo-100">Total Pesanan</p>
                        <p class="text-2xl font-bold">{{ $pesanan->count() }}</p>
                    </div>
                    <div class="px-4 py-3 bg-white/10 rounded-xl">
                        <p class="text-xs text-indigo-100">Menunggu Verifikasi</p>
                        <p class="text-2xl font-bold">{{ $pesanan->where('status_pesanan','menunggu_verifikasi')->count() }}</p>
                    </div>
                </div>
            </div>
        </div>

        @php
            $status = request('status');
            $filtered = $status ? $pesanan->where('status_pesanan', $status) : $pesanan;
            $badges = [
                'menunggu_verifikasi' => 'bg-amber-100 text-amber-800 border-amber-200',
                'menunggu_pembayaran' => 'bg-indigo-100 text-indigo-800 border-indigo-200',
                'selesai' => 'bg-emerald-100 text-emerald-800 border-emerald-200',
            ];
        @endphp

        <div class="flex flex-wrap gap-3">
            <a href="/pesanan-saya" class="px-4 py-2 rounded-full border {{ $status ? 'border-slate-200 text-slate-600' : 'border-indigo-200 text-indigo-700 bg-indigo-50' }} text-sm font-semibold">Semua</a>
            <a href="/pesanan-saya?status=menunggu_verifikasi" class="px-4 py-2 rounded-full border {{ $status === 'menunggu_verifikasi' ? 'border-indigo-200 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-600' }} text-sm font-semibold">Menunggu Verifikasi</a>
            <a href="/pesanan-saya?status=menunggu_pembayaran" class="px-4 py-2 rounded-full border {{ $status === 'menunggu_pembayaran' ? 'border-indigo-200 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-600' }} text-sm font-semibold">Pembayaran</a>
            <a href="/pesanan-saya?status=selesai" class="px-4 py-2 rounded-full border {{ $status === 'selesai' ? 'border-indigo-200 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-600' }} text-sm font-semibold">Selesai</a>
        </div>

        <div class="space-y-4">
            @forelse($filtered as $order)
                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div class="space-y-1">
                            <p class="text-sm text-slate-500">Paket</p>
                            <h2 class="text-xl font-semibold text-slate-900">{{ $order->paketTour->nama_paket ?? 'Paket' }}</h2>
                            <p class="text-sm text-slate-600">Jumlah peserta: {{ $order->jumlah_peserta }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            @php $badge = $badges[$order->status_pesanan] ?? 'bg-slate-100 text-slate-700 border-slate-200'; @endphp
                            <span class="px-3 py-1 rounded-full border text-xs font-semibold {{ $badge }}">{{ str_replace('_',' ', $order->status_pesanan) }}</span>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-3 gap-3">
                        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
                            <p class="text-xs text-slate-500 uppercase">Action</p>
                            <div class="flex gap-2 mt-2 flex-wrap">
                                <a href="/pesanan/{{ $order->id }}/peserta" class="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Input Data Peserta</a>
                                <a href="/paket/{{ $order->paketTour->id ?? $order->paket_id }}" class="px-3 py-2 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-50">Detail Paket</a>
                            </div>
                        </div>
                        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
                            <p class="text-xs text-slate-500 uppercase">Status</p>
                            <p class="font-semibold text-slate-800 mt-2">{{ ucfirst(str_replace('_',' ', $order->status_pesanan)) }}</p>
                            <p class="text-xs text-slate-500">Update data jika diminta admin</p>
                        </div>
                        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">
                            <p class="text-xs text-slate-500 uppercase">Kartu Tour</p>
                            <div class="mt-2 p-3 bg-white border border-dashed border-slate-200 rounded-lg text-sm text-slate-600">
                                <p class="font-semibold text-slate-800">#{{ $order->id }} / {{ $order->paketTour->nama_paket ?? 'Paket' }}</p>
                                <p>Tanggal: {{ $order->tanggal_pemesanan ?? 'TBD' }}</p>
                                <p>Peserta: {{ $order->jumlah_peserta }}</p>
                                <p>Status: {{ ucfirst(str_replace('_',' ', $order->status_pesanan)) }}</p>
                            </div>
                            <button type="button" onclick="window.print()" class="mt-3 px-3 py-2 w-full text-center border border-indigo-200 text-indigo-700 bg-indigo-50 rounded-lg text-sm font-semibold hover:bg-indigo-100">Cetak/Download PDF</button>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="border border-slate-200 rounded-xl p-4">
                            <p class="text-sm font-semibold text-slate-800">Rating perjalanan</p>
                            <form method="POST" action="{{ route('rating.store', $order->paketTour->id ?? $order->paket_id) }}" class="mt-3 flex flex-wrap gap-3 items-center">
                                @csrf
                                <select name="nilai_rating" class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    @for($i=1;$i<=5;$i++)
                                        <option value="{{ $i }}">{{ $i }}</option>
                                    @endfor
                                </select>
                                <input name="ulasan" placeholder="Tulis ulasan singkat" class="flex-1 min-w-[200px] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Kirim</button>
                            </form>
                        </div>
                        <div class="border border-slate-200 rounded-xl p-4">
                            <p class="text-sm font-semibold text-slate-800">Catatan status</p>
                            <ul class="text-sm text-slate-600 space-y-1 mt-2">
                                <li>• Menunggu verifikasi: data peserta sedang diperiksa admin.</li>
                                <li>• Pembayaran: lanjutkan pembayaran setelah diverifikasi.</li>
                                <li>• Selesai: perjalanan selesai, bagikan rating.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            @empty
                <div class="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                    Belum ada pesanan. Mulai dari halaman katalog untuk memilih paket.
                </div>
            @endforelse
        </div>
    </div>
</x-app-layout>
