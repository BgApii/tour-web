<x-app-layout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <p class="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Admin • Paket Tour</p>
                <h1 class="text-2xl font-bold text-slate-900">Kelola paket tour</h1>
                <p class="text-slate-600">Aktifkan/nonaktifkan, ubah harga, dan perbarui konten katalog.</p>
            </div>
            <a href="{{ route('admin.paket.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
                Tambah Paket
            </a>
        </div>

        <div class="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <tr>
                        <th class="px-6 py-3">Paket</th>
                        <th class="px-6 py-3">Harga</th>
                        <th class="px-6 py-3">Jadwal</th>
                        <th class="px-6 py-3">Tampil</th>
                        <th class="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($paket as $item)
                        <tr class="hover:bg-slate-50/80">
                            <td class="px-6 py-4">
                                <p class="font-semibold text-slate-900">{{ $item->nama_paket }}</p>
                                <p class="text-sm text-slate-500 truncate">{{ \Illuminate\Support\Str::limit($item->destinasi, 80) }}</p>
                            </td>
                            <td class="px-6 py-4 text-sm text-slate-700">Rp {{ number_format($item->harga_per_peserta,2,',','.') }}</td>
                            <td class="px-6 py-4 text-sm text-slate-700">
                                {{ $item->jadwal_keberangkatan ? \Illuminate\Support\Carbon::parse($item->jadwal_keberangkatan)->format('d M Y') : '-' }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-full text-xs font-semibold {{ $item->tampil_di_katalog ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700' }}">
                                    {{ $item->tampil_di_katalog ? 'Tampil' : 'Hidden' }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-end gap-2">
                                    <a href="{{ route('admin.paket.edit', $item->id) }}" class="px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100">Edit</a>
                                    <form method="POST" action="{{ $item->tampil_di_katalog ? route('admin.paket.hide', $item->id) : route('admin.paket.visible', $item->id) }}">
                                        @csrf
                                        @method('PUT')
                                        <button class="px-3 py-2 text-sm font-semibold {{ $item->tampil_di_katalog ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50' }} rounded-lg hover:opacity-90">
                                            {{ $item->tampil_di_katalog ? 'Sembunyikan' : 'Tampilkan' }}
                                        </button>
                                    </form>
                                    <form method="POST" action="{{ route('admin.paket.destroy', $item->id) }}">
                                        @csrf
                                        @method('DELETE')
                                        <button class="px-3 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100">Hapus</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-slate-500">Belum ada paket tour.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-app-layout>
