<?php

namespace App\Repositories\Interface;

use App\Repositories\BaseRepositoryInterface;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function show($email);

    public function getUser($id);

    public function getUserbyRefreshToken($data);

    public function updateRefreshToken($id, $token);

    public function getUsers();
}
