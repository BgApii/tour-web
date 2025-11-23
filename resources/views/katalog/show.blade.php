<x-app-layout>
    <div class="bg-white border-b border-slate-200">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="grid lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                    @if($paketTour->banner)
                        <div class="rounded-2xl overflow-hidden border border-slate-200">
                            <img src="{{ asset('storage/'.$paketTour->banner) }}" alt="{{ $paketTour->nama_paket }}" class="w-full h-64 object-cover">
                        </div>
                    @endif
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Paket Tour</p>
                            <h1 class="text-3xl font-bold text-slate-900">{{ $paketTour->nama_paket }}</h1>
                            <p class="text-slate-600 mt-2">{{ $paketTour->destinasi ?? 'Pengalaman perjalanan lengkap dengan destinasi pilihan dan itinerary efektif.' }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-slate-500">Mulai dari</p>
                            <p class="text-2xl font-bold text-indigo-700">Rp {{ number_format($paketTour->harga_per_peserta,2,',','.') }}</p>
                            <p class="text-xs text-slate-500">per peserta</p>
                        </div>
                    </div>

                    <div class="grid sm:grid-cols-3 gap-4">
                        <div class="p-4 border border-slate-200 rounded-xl bg-slate-50">
                            <p class="text-xs text-slate-500 uppercase">Jadwal</p>
                            <p class="font-semibold text-slate-800">
                                {{ $paketTour->jadwal_keberangkatan ? \Illuminate\Support\Carbon::parse($paketTour->jadwal_keberangkatan)->format('d M Y') : '-' }}
                            </p>
                        </div>
                        <div class="p-4 border border-slate-200 rounded-xl bg-slate-50">
                            <p class="text-xs text-slate-500 uppercase">Durasi</p>
                            <p class="font-semibold text-slate-800">{{ $paketTour->durasi ? $paketTour->durasi . ' hari' : '-' }}</p>
                        </div>
                        <div class="p-4 border border-slate-200 rounded-xl bg-slate-50">
                            <p class="text-xs text-slate-500 uppercase">Kuota</p>
                            <p class="font-semibold text-slate-800">{{ $paketTour->kuota ?? 'Tersedia' }} peserta</p>
                        </div>
                    </div>

                    <div class="border border-slate-200 rounded-xl p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-slate-900">Destinasi & Itinerary</h2>
                            <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">Open Trip</span>
                        </div>
                        @php
                            $destLines = $paketTour->destinasi ? preg_split('/\r\n|\r|\n/', $paketTour->destinasi) : [];
                        @endphp
                        @if(!empty(array_filter($destLines)))
                            <ul class="space-y-2 text-sm text-slate-600">
                                @foreach($destLines as $line)
                                    @continue($line === '')
                                    <li class="flex gap-3 items-start">
                                        <span class="h-2 w-2 rounded-full bg-indigo-500 mt-2"></span>
                                        <span class="whitespace-pre-line">{{ $line }}</span>
                                    </li>
                                @endforeach
                            </ul>
                        @else
                            <p class="text-slate-500 text-sm">Belum ada detail destinasi.</p>
                        @endif
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="border border-slate-200 rounded-xl p-5 space-y-3">
                            <h3 class="font-semibold text-slate-900">Persyaratan</h3>
                            <ul class="space-y-2 text-sm text-slate-600">
                                <li class="flex items-center gap-2">
                                    <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                                    Identitas: {{ $paketTour->wajib_identitas ? 'Wajib' : 'Opsional' }}
                                </li>
                                <li class="flex items-center gap-2">
                                    <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                                    Paspor: {{ $paketTour->wajib_paspor ? 'Wajib' : 'Tidak wajib' }}
                                </li>
                            </ul>
                        </div>
                        <div class="border border-slate-200 rounded-xl p-5 space-y-3">
                            <h3 class="font-semibold text-slate-900">Include</h3>
                            @php
                                $includeLines = $paketTour->include ? preg_split('/\r\n|\r|\n/', $paketTour->include) : [];
                            @endphp
                            @if(!empty(array_filter($includeLines)))
                                <ul class="space-y-2 text-sm text-slate-600">
                                    @foreach($includeLines as $line)
                                        @continue($line === '')
                                        <li class="flex gap-3 items-start">
                                            <span class="h-2 w-2 rounded-full bg-emerald-500 mt-2"></span>
                                            <span class="whitespace-pre-line">{{ $line }}</span>
                                        </li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-sm text-slate-500">Belum ada daftar include.</p>
                            @endif
                        </div>
                    </div>

                    <div class="border border-slate-200 rounded-xl p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-slate-900">Ulasan Paket</h3>
                            <span class="text-sm text-slate-500">Berikan pengalamanmu</span>
                        </div>

                        @auth
                            @if(auth()->user()->role === 'customer')
                                <form method="POST" action="{{ route('rating.store', $paketTour->id) }}" class="space-y-3">
                                    @csrf
                                    <div class="flex gap-3 items-center">
                                        <label class="text-sm text-slate-700 font-semibold">Rating</label>
                                        <select name="nilai_rating" class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
                                            @for($i = 1; $i <= 5; $i++)
                                                <option value="{{ $i }}">{{ $i }} / 5</option>
                                            @endfor
                                        </select>
                                    </div>
                                    <textarea name="ulasan" rows="3" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Ceritakan pengalamanmu..."></textarea>
                                    <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Kirim Ulasan</button>
                                </form>
                            @endif
                        @endauth

                        <div class="space-y-4">
                            @forelse($paketTour->ratings as $rating)
                                <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                                    <div class="flex items-center justify-between">
                                        <p class="font-semibold text-slate-800">{{ $rating->user->name ?? 'Customer' }}</p>
                                        <span class="text-indigo-700 font-semibold">{{ $rating->nilai_rating }} / 5</span>
                                    </div>
                                    <p class="text-sm text-slate-600 mt-1">{{ $rating->ulasan ?? 'Tanpa ulasan' }}</p>
                                </div>
                            @empty
                                <p class="text-sm text-slate-500">Belum ada ulasan.</p>
                            @endforelse
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm text-slate-500">Harga per peserta</p>
                                <p class="text-2xl font-bold text-indigo-700">Rp {{ number_format($paketTour->harga_per_peserta,0,',','.') }}</p>
                            </div>
                            <span class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-semibold">Kuota {{ $paketTour->kuota ?? 'Tersedia' }}</span>
                        </div>

                        @auth
                            @if(auth()->user()->role === 'customer')
                                <form method="POST" action="/pesan/{{ $paketTour->id }}" class="space-y-3">
                                    @csrf
                                    <label class="block text-sm font-semibold text-slate-700">Jumlah Peserta</label>
                                    <input type="number" name="jumlah_peserta" min="1" value="1" class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" required>
                                    <button class="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Pesan Sekarang</button>
                                </form>
                            @else
                                <p class="text-sm text-slate-500">Login sebagai customer untuk memesan.</p>
                            @endif
                        @else
                            <a href="/login" class="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold block text-center hover:bg-indigo-700">Login untuk memesan</a>
                        @endauth

                        <div class="pt-4 mt-4 border-t border-slate-200 space-y-2 text-sm text-slate-600">
                            <p>Termasuk: akomodasi, transport lokal, tiket objek wisata, dokumentasi.</p>
                            <p>Reschedule fleksibel sebelum H-7 keberangkatan.</p>
                        </div>
                    </div>

                    <div class="border border-indigo-100 bg-indigo-50 text-indigo-900 rounded-2xl p-5 space-y-2">
                        <p class="font-semibold">Butuh bantuan?</p>
                        <p class="text-sm">Tim kami siap membantu memilih paket terbaik dan menyiapkan perjalananmu.</p>
                        <a href="mailto:cs@tour.local" class="text-sm font-semibold text-indigo-700">Hubungi CS →</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
