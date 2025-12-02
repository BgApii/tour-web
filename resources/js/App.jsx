import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireRole from './components/RequireRole';
import { AuthProvider } from './providers/AuthProvider';

import KatalogPage from './pages/KatalogPage';
import DetailPaketPage from './pages/DetailPaketPage';
import LoginPage from './pages/LoginPage';
import PesananSayaPage from './pages/PesananSayaPage';
import FormPemesananPage from './pages/FormPemesananPage';
import FormPesertaPage from './pages/FormPesertaPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import RatingPage from './pages/RatingPage';
import ProfilePage from './pages/ProfilePage';
import {
    HalamanMenungguPembayaran,
    HalamanPembayaranSelesai,
    HalamanPesananSelesai,
    HalamanStatusPembayaran,
    HalamanStatusVerifikasi,
} from './pages/StatusPages';
import KelolaPaketPage from './pages/admin/KelolaPaketPage';
import PaketFormPage from './pages/admin/PaketFormPage';
import KelolaPesananPage from './pages/admin/KelolaPesananPage';
import PesananPage from './pages/admin/PesananPage';
import PesertaAdminPage from './pages/admin/PesertaAdminPage';
import RekapitulasiPage from './pages/owner/RekapitulasiPage';

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<KatalogPage />} />
                    <Route path="/paket" element={<KatalogPage />} />
                    <Route path="/paket/:id" element={<DetailPaketPage />} />
                    <Route
                        path="/paket/:id/pesan"
                        element={
                            <RequireRole roles={['customer']}>
                                <FormPemesananPage />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/paket/:id/rating"
                        element={
                            <RequireRole roles={['customer']}>
                                <RatingPage />
                            </RequireRole>
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/pesanan-saya"
                        element={
                            <RequireRole roles={['customer']}>
                                <PesananSayaPage />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pesanan/:id/data-peserta"
                        element={
                            <RequireRole roles={['customer']}>
                                <FormPesertaPage />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pesanan/:id/verifikasi"
                        element={
                            <RequireRole roles={['customer']}>
                                <HalamanStatusVerifikasi />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pesanan/:id/menunggu-pembayaran"
                        element={
                            <RequireRole roles={['customer']}>
                                <HalamanMenungguPembayaran />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pembayaran/:orderId/metode"
                        element={
                            <RequireRole roles={['customer']}>
                                <PaymentMethodPage />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pembayaran/:orderId/status"
                        element={
                            <RequireRole roles={['customer']}>
                                <HalamanStatusPembayaran />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pembayaran/:orderId/selesai"
                        element={
                            <RequireRole roles={['customer']}>
                                <HalamanPembayaranSelesai />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/pesanan/:id/selesai"
                        element={
                            <RequireRole roles={['customer']}>
                                <HalamanPesananSelesai />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/profil"
                        element={
                            <RequireRole roles={['admin', 'owner', 'customer']}>
                                <ProfilePage />
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
                    <Route path="paket" element={<KelolaPaketPage />} />
                    <Route path="paket/buat" element={<PaketFormPage />} />
                    <Route path="paket/:id/edit" element={<PaketFormPage />} />
                    <Route path="pesanan" element={<KelolaPesananPage />} />
                    <Route path="pesanan/paket/:paketId" element={<PesananPage />} />
                    <Route path="pesanan/order/:id" element={<PesertaAdminPage />} />
                </Route>

                <Route
                    path="/owner"
                    element={
                        <RequireRole roles={['owner']}>
                            <Layout />
                        </RequireRole>
                    }
                >
                    <Route path="rekapitulasi" element={<RekapitulasiPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}
