<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Controller untuk alur login dan logout.
 */
class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|View
     */
    public function create(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'ok']);
        }

        return view('app');
    }

    /**
     * Handle an incoming authentication request.
     *
     * @param LoginRequest $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Login berhasil',
                'user' => $user,
            ]);
        }

        if ($user && $user->role === 'admin') {
            return redirect()->intended(route('admin.paket.index', absolute: false));
        }

        if ($user && $user->role === 'customer') {
            return redirect()->intended('/');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Logout berhasil']);
        }

        return redirect('/');
    }
}
