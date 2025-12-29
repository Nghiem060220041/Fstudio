<?php

namespace App\Repositories\Repository;

use App\Models\User;
use App\Repositories\BaseRepository;
use App\Repositories\Interface\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    protected $user;

    public function __construct(
        User $user
    ) {
        $this->user = $user;
    }

    public function show($email)
    {
        $user = $this->user->find(auth()->id());

        return $user;
    }

    public function getUser($id)
    {
        $user = $this->user->find($id);

        return $user;
    }

    public function getUserbyRefreshToken($data)
    {
        $user = $this->user->where('refresh_token', $data['refreshToken'])->first();

        return $user;
    }

    public function updateRefreshToken($id, $token)
    {
        $user = $this->getUser($id);
        DB::transaction(function () use ($user, $token) {
            $refreshToken = Str::random(64);
            $user->refresh_token = $refreshToken;
            $user->refresh_token_expried = date('Y-m-d H:i:s', strtotime('+30 day'));
            $user->access_token = $token;
            $user->update();
        });
        return $user;
    }

    public function getUsers()
    {
        $users = $this->user->all();

        return $users;
    }
}
