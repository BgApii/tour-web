<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public controllers
use App\Http\Controllers\PaketTourController;

// Customer controllers
use App\Http\Controllers\Customer\PesananController;
use App\Http\Controllers\Customer\PesertaController;
use App\Http\Controllers\Customer\RatingController;

// Admin controllers
use App\Http\Controllers\Admin\PaketTourController as AdminPaketController;
use App\Http\Controllers\Admin\PesananController as PesananControllerAdmin;
use App\Http\Controllers\Admin\PesertaController as PesertaControllerAdmin;

// Owner controllers
use App\Http\Controllers\Owner\RekapitulasiController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\PaymentController;

// -----------------------------------------------------
// LANDING PAGE & KATALOG
// -----------------------------------------------------

Route::get('/', [PaketTourController::class, 'index']);
Route::get('/paket/{paketTour}', [PaketTourController::class, 'show']);
Route::get('/api/paket', [PaketTourController::class, 'index']);
Route::get('/api/paket/{paketTour}', [PaketTourController::class, 'show']);

// -----------------------------------------------------
// SOCIAL AUTH (GOOGLE)
// -----------------------------------------------------

Route::middleware('guest')->group(function () {
    Route::get('/auth/google/redirect', [SocialiteController::class, 'redirect'])->name('google.redirect');
    Route::get('/auth/google/callback', [SocialiteController::class, 'callback'])->name('google.callback');
});


// -----------------------------------------------------
// DASHBOARD BREEZE
// -----------------------------------------------------

Route::get('/dashboard', function () {
    return view('app');
})->middleware(['auth', 'verified'])->name('dashboard');


// -----------------------------------------------------
// PROFILE
// -----------------------------------------------------

Route::middleware('auth')->group(function () {
    Route::get('/api/me', function (Request $request) {
        return response()->json(['data' => $request->user()]);
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// -----------------------------------------------------
// CUSTOMER
// -----------------------------------------------------

Route::middleware(['auth', 'role:customer'])->group(function () {

    Route::get('/pesanan-saya', [PesananController::class, 'index']);
    Route::post('/pesan/{paketTour}', [PesananController::class, 'store']);

    Route::get('/pesanan/{pesanan}/peserta', [PesertaController::class, 'create']);
    Route::post('/pesanan/{pesanan}/peserta', [PesertaController::class, 'store']);
    Route::post('/pesanan/{pesanan}/selesai', [PesananController::class, 'markSelesai']);

    Route::post('/paket/{paketTour}/rating', [RatingController::class, 'store'])
        ->name('rating.store');

    Route::post('/payments/{pesanan}/snap-token', [PaymentController::class, 'createSnapToken']);
    Route::post('/payments/{pesanan}/confirm', [PaymentController::class, 'confirm']);
    Route::get('/payments/{pesanan}/status', [PaymentController::class, 'status']);
});


// -----------------------------------------------------
// ADMIN
// -----------------------------------------------------

Route::middleware(['auth','role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // resource route untuk kelola paket
        Route::resource('paket', AdminPaketController::class)
            ->parameters(['paket' => 'paketTour']);

        // hide & show paket
        Route::put('/paket/{paketTour}/hide', [AdminPaketController::class, 'hide'])
            ->name('paket.hide');
        Route::put('/paket/{paketTour}/show', [AdminPaketController::class, 'showPaket'])
            ->name('paket.visible');

        // kelola pesanan
        Route::get('/pesanan', [PesananControllerAdmin::class, 'index'])->name('pesanan.index');
        Route::get('/pesanan/{pesanan}', [PesananControllerAdmin::class, 'show'])->name('pesanan.show');

        // verifikasi peserta
        Route::put('/pesanan/{pesanan}/verify', [PesertaControllerAdmin::class, 'verify'])
            ->name('pesanan.verify');
        Route::put('/pesanan/{pesanan}/reject', [PesertaControllerAdmin::class, 'reject'])
            ->name('pesanan.reject');
    });


// -----------------------------------------------------
// OWNER
// -----------------------------------------------------

Route::middleware(['auth', 'role:owner'])->group(function () {
    Route::get('/owner/rekapitulasi', [RekapitulasiController::class, 'index'])
        ->name('owner.rekapitulasi');
});

require __DIR__.'/auth.php';

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
