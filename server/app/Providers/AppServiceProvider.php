<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interface\{
    AuthRepositoryInterface,
    RoleRepositoryInterface,
    UserRepositoryInterface,
};
use App\Repositories\Repository\{
    AuthRepository,
    RoleRepository,
    UserRepository,
};

class AppServiceProvider extends ServiceProvider
{
    protected static $repositories = [
        'auth' => [
            AuthRepositoryInterface::class,
            AuthRepository::class
        ],
        'role' => [
            RoleRepositoryInterface::class,
            RoleRepository::class
        ],
        'user' => [
            UserRepositoryInterface::class,
            UserRepository::class
        ],
    ];

    public function register(): void
    {
        foreach (static::$repositories as $repository) {
            $this->app->bind($repository[0], $repository[1]);
        }
    }

    public function boot(): void
    {
    }
}
