<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (Exception $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Gagal login dengan Google, silakan coba lagi.',
            ]);
        }

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName() ?? $googleUser->getNickname() ?? 'Pengguna',
                'password' => Str::random(40),
                'role' => 'customer',
            ]
        );

        // Pastikan nama terbarui jika berubah di Google
        if ($googleUser->getName() && $googleUser->getName() !== $user->name) {
            $user->name = $googleUser->getName();
            $user->save();
        }

        Auth::login($user, remember: true);

        if ($user->role === 'admin') {
            return redirect()->intended(route('admin.paket.index', absolute: false));
        }

        if ($user->role === 'customer') {
            return redirect()->intended('/');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
