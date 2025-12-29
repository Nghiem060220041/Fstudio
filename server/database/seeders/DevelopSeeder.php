<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DevelopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = [
            'name' => 'develop',
            'email' => 'develop@gmail.com',
            'password' => Hash::make('password'),
            'active' => config('constant.active'),
        ];

        User::create($admin);
    }
}
