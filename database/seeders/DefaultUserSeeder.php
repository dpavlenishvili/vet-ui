<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

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
            'birth_date' => '1993-23-08',
            'residential' => 'GE',
            'region' => 'Tbilisi',
            'city' => 'Tbilisi',
            'address' => '1 Infinite Loop, Cupertino, California.',
            'password' => bcrypt('987654321'),
            'phone' => '555555555',
            '2fa' => 0,
        ]);
    }
}
