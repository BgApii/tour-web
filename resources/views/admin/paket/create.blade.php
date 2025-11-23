<x-app-layout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Admin</p>
                <h1 class="text-2xl font-bold text-slate-900">Tambah Paket Tour</h1>
                <p class="text-slate-600">Isi detail paket yang akan tampil di katalog publik.</p>
            </div>
            <a href="{{ route('admin.paket.index') }}" class="text-sm text-indigo-700 font-semibold">Kembali</a>
        </div>

        <form method="POST" action="{{ route('admin.paket.store') }}" enctype="multipart/form-data" class="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            @csrf
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="text-sm font-semibold text-slate-700">Nama Paket</label>
                    <input name="nama_paket" required class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Contoh: Explore Bali 3D2N">
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-700">Harga per Peserta</label>
                    <input type="number" step="0.01" min="0" name="harga_per_peserta" required class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="1500000.00">
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-700">Banner (Upload)</label>
                    <input type="file" name="banner" accept="image/*" required class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 bg-white">
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-700">Jadwal Keberangkatan</label>
                    <input type="date" name="jadwal_keberangkatan" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-700">Durasi</label>
                    <input type="number" min="1" name="durasi" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="3 (hari)">
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-700">Kuota</label>
                    <input name="kuota" type="number" min="1" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="20">
                </div>
                <label class="inline-flex items-center gap-2 text-sm text-slate-700 pt-6">
                    <input type="hidden" name="tampil_di_katalog" value="0">
                    <input type="checkbox" name="tampil_di_katalog" value="1" class="rounded border-slate-300 text-indigo-600" checked>
                    Tampilkan di katalog
                </label>
            </div>

            <div>
                <label class="text-sm font-semibold text-slate-700">Destinasi & Highlight / Itinerary</label>
                <textarea name="destinasi" rows="4" required class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Pisahkan poin dengan Enter. Contoh:&#10;- Hari 1: Kedatangan&#10;- Hari 2: Diving di spot A"></textarea>
            </div>
            <div>
                <label class="text-sm font-semibold text-slate-700">Include (fasilitas)</label>
                <textarea name="include" rows="3" required class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Pisahkan poin dengan Enter. Contoh:&#10;- Hotel 3 malam&#10;- Transport antar jemput&#10;- Dokumentasi"></textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <label class="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="hidden" name="wajib_identitas" value="0">
                    <input type="checkbox" name="wajib_identitas" value="1" class="rounded border-slate-300 text-indigo-600" checked>
                    Wajib upload identitas
                </label>
                <label class="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="hidden" name="wajib_paspor" value="0">
                    <input type="checkbox" name="wajib_paspor" value="1" class="rounded border-slate-300 text-indigo-600">
                    Wajib paspor
                </label>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
                <a href="{{ route('admin.paket.index') }}" class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</a>
                <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Simpan Paket</button>
            </div>
        </form>
    </div>
</x-app-layout>
