<x-app-layout>
    <div class="bg-gradient-to-br from-sky-50 via-white to-indigo-50 border-b border-indigo-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div class="space-y-4 max-w-2xl">
                    <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold uppercase tracking-wide">
                        Paket Tour Unggulan
                    </p>
                    <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                        Jelajahi dunia dengan pilihan paket terbaik kami
                    </h1>
                    <p class="text-lg text-slate-700">
                        Temukan paket wisata dengan jadwal fleksibel, durasi beragam, dan pengalaman tak terlupakan untuk setiap perjalanan.
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <span class="px-4 py-2 bg-white/70 border border-indigo-100 text-indigo-700 rounded-full text-sm shadow-sm">Harga transparan</span>
                        <span class="px-4 py-2 bg-white/70 border border-indigo-100 text-indigo-700 rounded-full text-sm shadow-sm">Jadwal pasti</span>
                        <span class="px-4 py-2 bg-white/70 border border-indigo-100 text-indigo-700 rounded-full text-sm shadow-sm">Kuota terbatas</span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div class="p-4 bg-white shadow-sm rounded-2xl border border-indigo-50">
                        <p class="text-xs text-slate-400">Destinasi Populer</p>
                        <p class="text-lg font-semibold text-indigo-700">Bali, Lombok, Labuan Bajo</p>
                    </div>
                    <div class="p-4 bg-white shadow-sm rounded-2xl border border-indigo-50">
                        <p class="text-xs text-slate-400">Jenis Perjalanan</p>
                        <p class="text-lg font-semibold text-indigo-700">Open Trip & Private</p>
                    </div>
                    <div class="p-4 bg-white shadow-sm rounded-2xl border border-indigo-50">
                        <p class="text-xs text-slate-400">Pembayaran</p>
                        <p class="text-lg font-semibold text-indigo-700">DP & Pelunasan</p>
                    </div>
                    <div class="p-4 bg-white shadow-sm rounded-2xl border border-indigo-50">
                        <p class="text-xs text-slate-400">Layanan</p>
                        <p class="text-lg font-semibold text-indigo-700">CS 24/7</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm uppercase tracking-wide text-slate-500 font-semibold">Katalog Paket</p>
                <h2 class="text-2xl font-bold text-slate-900">Pilih paket sesuai rencana perjalananmu</h2>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-sm text-slate-500">Urutkan:</span>
                <div class="inline-flex rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <button class="px-3 py-1.5 text-sm text-indigo-700 font-semibold bg-indigo-50">Terpopuler</button>
                    <button class="px-3 py-1.5 text-sm text-slate-500">Harga</button>
                    <button class="px-3 py-1.5 text-sm text-slate-500">Tanggal</button>
                </div>
            </div>
        </div>

        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            @forelse($paket as $item)
                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col">
                    @php
                        $bg = $item->banner ? asset('storage/'.$item->banner) : null;
                    @endphp
                    <div class="h-44 rounded-t-2xl relative overflow-hidden {{ $bg ? 'bg-cover bg-center' : 'bg-gradient-to-br from-indigo-200 via-sky-100 to-white' }}"
                        @if($bg) style="background-image: url('{{ $bg }}')" @endif>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div class="absolute bottom-3 left-4 right-4 flex justify-between items-center">
                            <span class="text-sm text-white font-semibold drop-shadow">Kuota {{ $item->kuota ?? 'Tersedia' }}</span>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col gap-3">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-slate-900">{{ $item->nama_paket }}</h3>
                                <p class="text-sm text-indigo-600 font-semibold">Rp {{ number_format($item->harga_per_peserta,2,',','.') }} <span class="text-slate-500 text-xs">/pax</span></p>
                            </div>
                        <p class="text-sm text-slate-600 overflow-hidden text-ellipsis">{{ $item->destinasi ?? 'Pengalaman wisata seru dengan itinerary padat dan guide profesional.' }}</p>
                        <div class="flex flex-wrap gap-2 text-xs text-slate-600">
                            <span class="px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                                Jadwal: {{ $item->jadwal_keberangkatan ? \Illuminate\Support\Carbon::parse($item->jadwal_keberangkatan)->format('d M Y') : '-' }}
                            </span>
                            <span class="px-3 py-1 rounded-full bg-slate-50 border border-slate-200">Durasi: {{ $item->durasi ? $item->durasi . ' hari' : '-' }}</span>
                            @if($item->wajib_paspor)
                                <span class="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">Wajib Paspor</span>
                            @endif
                        </div>
                        <div class="flex items-center justify-between pt-2">
                            <a href="/paket/{{ $item->id }}" class="text-indigo-600 font-semibold hover:text-indigo-800">Lihat detail</a>
                            <div class="flex gap-2">
                                <a href="/paket/{{ $item->id }}" class="px-4 py-2 rounded-lg bg-white border border-indigo-100 text-indigo-700 hover:bg-indigo-50 text-sm font-semibold">Detail</a>
                                <a href="/paket/{{ $item->id }}" class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-semibold">Pesan</a>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                    Belum ada paket tour aktif saat ini.
                </div>
            @endforelse
        </div>
    </div>
</x-app-layout>
