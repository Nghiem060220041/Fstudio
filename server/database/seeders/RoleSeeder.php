<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            config('permissions')['roles']['super-admin'],
            config('permissions')['roles']['develop'],
        ];

        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }
    }
}
