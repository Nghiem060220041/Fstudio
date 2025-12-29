<?php

namespace App\Repositories\Repository;

use App\Repositories\BaseRepository;
use App\Repositories\Interface\AuthRepositoryInterface;
use App\Models\User;

class AuthRepository extends BaseRepository implements AuthRepositoryInterface
{
    protected $user;

    public function __construct(
        User $user
    ) {
        $this->user = $user;
    }
}
