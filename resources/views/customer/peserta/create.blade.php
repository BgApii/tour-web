<x-app-layout>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Data Peserta</p>
                <h1 class="text-2xl font-bold text-slate-900">Lengkapi informasi peserta untuk pesanan #{{ $pesanan->id }}</h1>
                <p class="text-slate-600 mt-2">Jumlah peserta: {{ $pesanan->jumlah_peserta }}</p>
            </div>
            <a href="/pesanan-saya" class="text-sm text-indigo-700 font-semibold">Kembali ke pesanan</a>
        </div>

        <form action="/pesanan/{{ $pesanan->id }}/peserta" method="POST" class="space-y-6">
            @csrf
            <div class="grid gap-6">
                @for($i = 0; $i < $pesanan->jumlah_peserta; $i++)
                    <div class="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-lg font-semibold text-slate-900">Peserta {{ $i + 1 }}</p>
                            <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">Wajib diisi</span>
                        </div>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                                <input required name="peserta[{{ $i }}][nama_lengkap]" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Nama sesuai identitas">
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-slate-700">Email</label>
                                <input type="email" required name="peserta[{{ $i }}][email]" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="email@contoh.com">
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-slate-700">Telepon</label>
                                <input required name="peserta[{{ $i }}][telepon]" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="08xxxx">
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-slate-700">Alamat</label>
                                <input required name="peserta[{{ $i }}][alamat]" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Alamat domisili">
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-slate-700">Nomor Identitas</label>
                                <input name="peserta[{{ $i }}][foto_identitas]" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="KTP/SIM">
                            </div>
                            <div>
                                <label class="text-sm font-semibold text-slate-700">Nomor Paspor</label>
                                <input name="peserta[{{ $i }}][paspor]" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Opsional jika domestik">
                            </div>
                        </div>
                    </div>
                @endfor
            </div>

            <div class="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <p class="text-sm text-slate-600">Pastikan data benar sebelum dikirim. Admin akan memverifikasi sebelum pembayaran.</p>
                <button class="px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">Kirim Data</button>
            </div>
        </form>
    </div>
</x-app-layout>
