<?php

namespace App\Repositories\Interface;

use App\Repositories\BaseRepositoryInterface;

interface RoleRepositoryInterface extends BaseRepositoryInterface
{
    public function show();

    public function getRole($id);

    public function getRoles();

    public function getRoleFilters($data);

    public function createRole($data);

    public function updateRole($data, $id);

    public function deleteRole($id);
}
