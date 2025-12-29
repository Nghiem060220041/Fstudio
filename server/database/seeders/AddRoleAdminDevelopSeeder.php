<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddRoleAdminDevelopSeeder extends Seeder
{
    public function run(): void
    {
        $roleAdmin = [
            'role_id' => config('constant.super_admin_id'),
            'model_type' => User::class,
            'model_id' => config('constant.super_admin_id')
        ];
        $roleDevelop = [
            'role_id' => config('constant.develop_id'),
            'model_type' => User::class,
            'model_id' => config('constant.develop_id')
        ];

        UserRole::create($roleAdmin);
        UserRole::create($roleDevelop);
    }
}
