<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $collection = collect(config('vet.permissions'));

        $collection->each(function ($permissions, $guard) {
            foreach ($permissions as $permission => $actions) {
                foreach ($actions as $action) {
                    Permission::updateOrCreate(
                        ['guard_name' => $guard, 'group' => $permission, 'name' =>  $action.$permission]
                    );
                }
            }
        });

        // Create a Super-Admin Role and assign all Permissions
        $role = Role::updateOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $role->givePermissionTo(Permission::where('guard_name', 'web')->get());
    }
}
