<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DefaultUserSeeder extends Seeder
{
    public function run()
    {
        $superAdmin = User::updateOrCreate([
            'email' => 'admin@vet.ge',
        ], [
            'pid' => '1000',
            'name' => 'Super Admin',
            'first_name' => 'Super',
            'last_name' => 'admin',
            'gender' => 'male',
            'residential' => 'GE',
            'region' => 'Tbilisi',
            'city' => 'Tbilisi',
            'address' => '1 Infinite Loop, Cupertino, California.',
            'password' => bcrypt('987654321'),
            'phone' => '555555555',
            '2fa' => false,
        ]);

        if (Role::where('name', 'Super Admin')->exists()) {
            $superAdmin->assignRole('Super Admin');
        }
    }
}
