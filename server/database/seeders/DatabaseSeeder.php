<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

        public function dataSeeder()
        {
            return [
                AdminSeeder::class,
                DevelopSeeder::class,
                RoleSeeder::class,
                PermissionSeeder::class,
                AddRoleAdminDevelopSeeder::class,
            ];
        }

        public function run(): void
        {
            $this->call($this->dataSeeder());
        }
}
