<?php

use App\Http\Controllers\ProfileController;
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

// -----------------------------------------------------
// LANDING PAGE & KATALOG
// -----------------------------------------------------

Route::get('/', [PaketTourController::class, 'index']);
Route::get('/paket/{paketTour}', [PaketTourController::class, 'show']);


// -----------------------------------------------------
// DASHBOARD BREEZE
// -----------------------------------------------------

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// -----------------------------------------------------
// PROFILE
// -----------------------------------------------------

Route::middleware('auth')->group(function () {
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

    Route::post('/paket/{paketTour}/rating', [RatingController::class, 'store'])
        ->name('rating.store');
});


// -----------------------------------------------------
// ADMIN
// -----------------------------------------------------

Route::middleware(['auth','role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // resource route untuk kelola paket
        Route::resource('paket', AdminPaketController::class);

        // hide & show paket
        Route::put('/paket/{paketTour}/hide', [AdminPaketController::class, 'hide'])
            ->name('paket.hide');
        Route::put('/paket/{paketTour}/show', [AdminPaketController::class, 'showPaket'])
            ->name('paket.visible');

        // kelola pesanan
        Route::get('/pesanan', [PesananControllerAdmin::class, 'index'])->name('pesanan.index');
        Route::get('/pesanan/{pesanan}', [PesananControllerAdmin::class, 'show'])->name('pesanan.show');

        // verifikasi peserta
        Route::put('/peserta/{peserta}/verify', [PesertaControllerAdmin::class, 'verify'])
            ->name('peserta.verify');
        Route::put('/peserta/{peserta}/reject', [PesertaControllerAdmin::class, 'reject'])
            ->name('peserta.reject');
    });


// -----------------------------------------------------
// OWNER
// -----------------------------------------------------

Route::middleware(['auth', 'role:owner'])->group(function () {
    Route::get('/owner/rekapitulasi', [RekapitulasiController::class, 'index'])
        ->name('owner.rekapitulasi');
});

require __DIR__.'/auth.php';
