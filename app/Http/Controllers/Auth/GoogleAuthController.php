<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        abort_unless($this->googleConfigured(), 503, 'Google sign-in is not configured yet.');

        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        abort_unless($this->googleConfigured(), 503, 'Google sign-in is not configured yet.');

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable) {
            return to_route('login')->withErrors([
                'email' => 'Google sign-in could not be completed. Please try again.',
            ]);
        }

        $email = $googleUser->getEmail();
        $googleId = $googleUser->getId();
        $emailVerified = ($googleUser->user['verified_email'] ?? false) === true;

        if (! $email || ! $googleId || ! $emailVerified) {
            return to_route('login')->withErrors([
                'email' => 'Google must provide a verified email address to create or access an Afya360 account.',
            ]);
        }

        $user = DB::transaction(function () use ($email, $googleId, $googleUser): User {
            $user = User::query()
                ->where('google_id', $googleId)
                ->orWhere('email', Str::lower($email))
                ->lockForUpdate()
                ->first();

            if ($user && $user->google_id && $user->google_id !== $googleId) {
                abort(403, 'This email address is linked to another Google account.');
            }

            if (! $user) {
                return User::query()->create([
                    'name' => $googleUser->getName() ?: Str::before($email, '@'),
                    'email' => Str::lower($email),
                    'password' => Str::random(64),
                    'google_id' => $googleId,
                    'email_verified_at' => now(),
                ]);
            }

            $user->forceFill([
                'google_id' => $googleId,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ])->save();

            return $user;
        });

        Auth::login($user, remember: true);
        request()->session()->regenerate();

        return redirect()->intended(config('fortify.home', '/'));
    }

    private function googleConfigured(): bool
    {
        return filled(config('services.google.client_id'))
            && filled(config('services.google.client_secret'))
            && filled(config('services.google.redirect'));
    }
}
