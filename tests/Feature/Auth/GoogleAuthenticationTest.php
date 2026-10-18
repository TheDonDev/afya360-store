<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

function googleUser(array $raw = []): SocialiteUser
{
    return SocialiteUser::fake([
        'id' => 'google-user-123',
        'name' => 'Google Shopper',
        'email' => 'google@example.com',
    ])->setRaw(array_merge([
        'verified_email' => true,
    ], $raw));
}

test('google sign in creates a verified account for a verified google email', function () {
    config([
        'services.google.client_id' => 'client-id',
        'services.google.client_secret' => 'client-secret',
        'services.google.redirect' => 'http://localhost/auth/google/callback',
    ]);

    $provider = Mockery::mock();
    $provider->shouldReceive('user')->once()->andReturn(googleUser());
    Socialite::shouldReceive('driver')->with('google')->once()->andReturn($provider);

    $this->get(route('google.callback'))
        ->assertRedirect('/');

    $user = User::query()->where('email', 'google@example.com')->firstOrFail();
    expect($user->google_id)->toBe('google-user-123')
        ->and($user->hasVerifiedEmail())->toBeTrue();
    $this->assertAuthenticatedAs($user);
});

test('google sign in links to an existing account with the same verified email', function () {
    config([
        'services.google.client_id' => 'client-id',
        'services.google.client_secret' => 'client-secret',
        'services.google.redirect' => 'http://localhost/auth/google/callback',
    ]);
    $existing = User::factory()->unverified()->create([
        'email' => 'google@example.com',
    ]);

    $provider = Mockery::mock();
    $provider->shouldReceive('user')->once()->andReturn(googleUser());
    Socialite::shouldReceive('driver')->with('google')->once()->andReturn($provider);

    $this->get(route('google.callback'))->assertRedirect('/');

    expect(User::query()->count())->toBe(1)
        ->and($existing->fresh()->google_id)->toBe('google-user-123')
        ->and($existing->fresh()->hasVerifiedEmail())->toBeTrue();
    $this->assertAuthenticatedAs($existing);
});

test('google sign in rejects an unverified provider email', function () {
    config([
        'services.google.client_id' => 'client-id',
        'services.google.client_secret' => 'client-secret',
        'services.google.redirect' => 'http://localhost/auth/google/callback',
    ]);

    $provider = Mockery::mock();
    $provider->shouldReceive('user')->once()->andReturn(googleUser([
        'verified_email' => false,
    ]));
    Socialite::shouldReceive('driver')->with('google')->once()->andReturn($provider);

    $this->get(route('google.callback'))
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors('email');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

test('google sign in routes are unavailable until credentials are configured', function () {
    config([
        'services.google.client_id' => null,
        'services.google.client_secret' => null,
        'services.google.redirect' => null,
    ]);

    $this->get(route('google.redirect'))->assertServiceUnavailable();

    $this->get(route('login'))
        ->assertInertia(fn ($page) => $page
            ->component('auth/login')
            ->where('googleEnabled', false));
});
