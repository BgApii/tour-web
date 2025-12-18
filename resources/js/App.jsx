import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireRole from './components/RequireRole';
import StatusScreen from './components/StatusScreen';
import { AuthProvider } from './providers/AuthProvider';

import HalamanKatalog from './pages/HalamanKatalog';
import HalamanDetail from './pages/HalamanDetail';
import HalamanLogin from './pages/HalamanLogin';
import HalamanPesananSaya from './pages/HalamanPesananSaya';
import HalamanFormPemesanan from './pages/HalamanFormPemesanan';
import FormPeserta from './pages/FormPeserta';
import HalamanMetodePembayaran from './pages/HalamanMetodePembayaran';
import FormPenilaian from './pages/FormPenilaian';
import MenuProfil from './pages/MenuProfil';
import HalamanKelolaPaket from './pages/admin/HalamanKelolaPaket';
import FormDataPaket from './pages/admin/FormDataPaket';
import HalamanKelolaPesanan from './pages/admin/HalamanKelolaPesanan';
import HalamanPesanan from './pages/admin/HalamanPesanan';
import HalamanDataPeserta from './pages/admin/HalamanDataPeserta';
import HalamanRekapitulasi from './pages/owner/HalamanRekapitulasi';

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HalamanKatalog />} />
                    <Route path="/paket" element={<HalamanKatalog />} />
                    <Route path="/paket/:id" element={<HalamanDetail />} />
                    <Route
                        path="/paket/:id/pesan"
                        element={
                            <RequireRole roles={['customer']}>
                                <HalamanFormPemesanan />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pesanan/:id/rating"
                        element={
                            <RequireRole roles={['customer']}>
                                <FormPenilaian />
                            </RequireRole>
                        }
                    />
                    <Route path="/login" element={<HalamanLogin />} />
                    <Route
                        path="/pesanan-saya"
                        element={
                            <RequireRole roles={['customer']}>
                                <HalamanPesananSaya />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pesanan/:id/data-peserta"
                        element={
                            <RequireRole roles={['customer']}>
                                <FormPeserta />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pesanan/:id/verifikasi"
                        element={
                            <RequireRole roles={['customer']}>
                                <StatusScreen
                                    title="Menunggu Verifikasi"
                                    description="Data peserta sedang diperiksa admin. Kamu akan mendapat notifikasi ketika sudah siap dibayar."
                                    hint="Pastikan kontak dan email aktif agar update status tidak terlewat."
                                    actionLabel="Kembali ke pesanan"
                                    actionHref="/pesanan-saya"
                                />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pesanan/:id/menunggu-pembayaran"
                        element={
                            <RequireRole roles={['customer']}>
                                <StatusScreen
                                    title="Menunggu Pembayaran"
                                    description="Data sudah diverifikasi. Lanjutkan pembayaran sesuai metode yang tersedia."
                                    hint="Gunakan Midtrans untuk pembayaran cepat dan aman."
                                    actionLabel="Pilih metode pembayaran"
                                    actionHref="/pesanan-saya"
                                />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pembayaran/:orderId/metode"
                        element={
                            <RequireRole roles={['customer']}>
                                <HalamanMetodePembayaran />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pembayaran/:orderId/status"
                        element={
                            <RequireRole roles={['customer']}>
                                <StatusScreen
                                    title="Status Pembayaran"
                                    description="Transaksi sedang diproses. Jika kamu sudah membayar, status akan otomatis berubah ke pembayaran selesai."
                                    hint="Jika status tidak berubah dalam 5 menit, hubungi admin dengan bukti bayar."
                                    actionLabel="Kembali"
                                    actionHref="/pesanan-saya"
                                />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pembayaran/:orderId/selesai"
                        element={
                            <RequireRole roles={['customer']}>
                                <StatusScreen
                                    title="Pembayaran Selesai"
                                    description="Terima kasih! Pembayaranmu sudah diterima. Tim kami akan menyiapkan perjalananmu."
                                    actionLabel="Lihat pesanan"
                                    actionHref="/pesanan-saya"
                                />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pesanan/:id/selesai"
                        element={
                            <RequireRole roles={['customer']}>
                                <StatusScreen
                                    title="Pesanan Selesai"
                                    description="Perjalananmu telah berakhir. Bagikan pengalaman melalui rating untuk membantu traveler lain."
                                    actionLabel="Beri rating"
                                    actionHref="/pesanan-saya"
                                />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/profil"
                        element={
                            <RequireRole roles={['admin', 'owner', 'customer']}>
                                <MenuProfil />
                            </RequireRole>
                        }
                    />
                </Route>

                <Route
                    path="/admin"
                    element={
                        <RequireRole roles={['admin']}>
                            <Layout />
                        </RequireRole>
                    }
                >
                    <Route index element={<Navigate to="/admin/paket" replace />} />
                    <Route path="paket" element={<HalamanKelolaPaket />} />
                    <Route path="paket/buat" element={<FormDataPaket />} />
                    <Route path="paket/:id/edit" element={<FormDataPaket />} />
                    <Route path="pesanan" element={<HalamanKelolaPesanan />} />
                    <Route path="pesanan/paket/:paketId" element={<HalamanPesanan />} />
                    <Route path="pesanan/order/:id" element={<HalamanDataPeserta />} />
                </Route>

                <Route
                    path="/owner"
                    element={
                        <RequireRole roles={['owner']}>
                            <Layout />
                        </RequireRole>
                    }
                >
                    <Route path="rekapitulasi" element={<HalamanRekapitulasi />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}
