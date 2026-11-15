<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Notifications\ResetPassword;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function sendPasswordResetNotification($token): void
    {
        $frontendUrl = rtrim(
            env('FRONTEND_URL', 'http://localhost:5173'),
            '/'
        );

        $url = $frontendUrl . '/reset-password?token='
            . urlencode($token)
            . '&email=' . urlencode($this->email);

        $notification = new ResetPassword($token);

        $notification->createUrlUsing(function () use ($url) {
            return $url;
        });

        $this->notify($notification);
    }
}