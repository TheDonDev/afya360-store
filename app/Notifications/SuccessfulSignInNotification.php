<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SuccessfulSignInNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly string $ipAddress,
        private readonly string $signedInAt,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New sign-in to your Afya360 account')
            ->greeting('Hello '.$notifiable->name.',')
            ->line('Your Afya360 account was just signed in to.')
            ->line('Time: '.$this->signedInAt)
            ->line('IP address: '.$this->ipAddress)
            ->line('If this was not you, reset your password and contact Afya360 support.')
            ->action('Visit Afya360', url('/'));
    }
}
