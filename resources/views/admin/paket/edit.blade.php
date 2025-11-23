<x-app-layout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Admin</p>
                <h1 class="text-2xl font-bold text-slate-900">Edit Paket Tour</h1>
                <p class="text-slate-600">Perbarui informasi paket {{ $paketTour->nama_paket }}.</p>
            </div>
            <a href="{{ route('admin.paket.index') }}" class="text-sm text-indigo-700 font-semibold">Kembali</a>
        </div>

        <form method="POST" action="{{ route('admin.paket.update', ['paket' => $paketTour->getKey()]) }}" enctype="multipart/form-data" class="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            @csrf
            @method('PUT')
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="text-sm font-semibold text-slate-700">Nama Paket</label>
                    <input name="nama_paket" value="{{ $paketTour->nama_paket }}" required class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-700">Harga per Peserta</label>
                    <input type="number" step="0.01" min="0" name="harga_per_peserta" value="{{ $paketTour->harga_per_peserta }}" required class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-semibold text-slate-700">Banner (Upload baru jika ingin ganti)</label>
                    <input type="file" name="banner" accept="image/*" class="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 bg-white">
                    @if($paketTour->banner)
                        <div class="rounded-lg border border-slate-200 overflow-hidden">
                            <img src="{{ asset('storage/'.$paketTour->banner) }}" alt="Banner" class="w-full h-32 object-cover">
                        </div>
                    @endif
                </div>
                @php
                    $jadwalDate = $paketTour->jadwal_keberangkatan
                        ? \Illuminate\Support\Carbon::parse($paketTour->jadwal_keberangkatan)->format('Y-m-d')
                        : '';
                @endphp
                <div>
                    <label class="text-sm font-semibold text-slate-700">Jadwal Keberangkatan</label>
                    <input type="date" name="jadwal_keberangkatan" value="{{ $jadwalDate }}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-700">Durasi</label>
                    <input type="number" min="1" name="durasi" value="{{ $paketTour->durasi }}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-700">Kuota</label>
                    <input name="kuota" type="number" min="1" value="{{ $paketTour->kuota }}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500">
                </div>
            </div>

            <div>
                <label class="text-sm font-semibold text-slate-700">Destinasi & Highlight / Itinerary</label>
                <textarea name="destinasi" rows="4" required class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Pisahkan poin dengan Enter">{{ $paketTour->destinasi }}</textarea>
            </div>
            <div>
                <label class="text-sm font-semibold text-slate-700">Include (fasilitas)</label>
                <textarea name="include" rows="3" required class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Pisahkan poin dengan Enter">{{ $paketTour->include }}</textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <label class="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="hidden" name="wajib_identitas" value="0">
                    <input type="checkbox" name="wajib_identitas" value="1" class="rounded border-slate-300 text-indigo-600" @checked($paketTour->wajib_identitas)>
                    Wajib upload identitas
                </label>
                <label class="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="hidden" name="wajib_paspor" value="0">
                    <input type="checkbox" name="wajib_paspor" value="1" class="rounded border-slate-300 text-indigo-600" @checked($paketTour->wajib_paspor)>
                    Wajib paspor
                </label>
                <label class="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="hidden" name="tampil_di_katalog" value="0">
                    <input type="checkbox" name="tampil_di_katalog" value="1" class="rounded border-slate-300 text-indigo-600" @checked($paketTour->tampil_di_katalog)>
                    Tampilkan di katalog
                </label>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
                <a href="{{ route('admin.paket.index') }}" class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</a>
                <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Simpan Perubahan</button>
            </div>
        </form>
    </div>
</x-app-layout>
