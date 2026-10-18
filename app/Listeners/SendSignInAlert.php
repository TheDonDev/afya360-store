<?php

namespace App\Listeners;

use App\Notifications\SuccessfulSignInNotification;
use Illuminate\Auth\Events\Login;

class SendSignInAlert
{
    public function handle(Login $event): void
    {
        if ($event->guard !== 'web') {
            return;
        }

        $event->user->notify(new SuccessfulSignInNotification(
            request()->ip() ?? 'Unavailable',
            now()->toDayDateTimeString(),
        ));
    }
}
