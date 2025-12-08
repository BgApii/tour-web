<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

/**
 * Controller untuk profil pengguna (lihat, perbarui, hapus akun).
 */
class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|View
     */
    public function edit(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['data' => $request->user()]);
        }

        return view('app');
    }

    /**
     * Update the user's profile information.
     *
     * @param ProfileUpdateRequest $request
     * @return \Illuminate\Http\JsonResponse|RedirectResponse
     */
    public function update(ProfileUpdateRequest $request)
    {
        $request->user()->fill($request->validated());

        $request->user()->save();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Profil diperbarui',
                'data' => $request->user(),
            ]);
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|RedirectResponse
     */
    public function destroy(Request $request)
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Akun dihapus']);
        }

        return Redirect::to('/');
    }
}
