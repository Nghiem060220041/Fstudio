<?php

namespace Database\Seeders;

use App\Models\{
    Banner,
    Category,
    Order,
    Blog,
    Brand,
    Product,
    Revenue,
    Role as ModelsRole,
    Sale,
    Store,
    User,
    Warehouse
};
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            config('permissions')['users']['user.list'],
            config('permissions')['users']['user.create'],
            config('permissions')['users']['user.edit'],
            config('permissions')['users']['user.delete'],

            config('permissions')['roles']['role.list'],
            config('permissions')['roles']['role.create'],
            config('permissions')['roles']['role.edit'],
            config('permissions')['roles']['role.delete'],

            config('permissions')['products']['product.list'],
            config('permissions')['products']['product.create'],
            config('permissions')['products']['product.edit'],
            config('permissions')['products']['product.delete'],

        
            config('permissions')['categories']['category.list'],
            config('permissions')['categories']['category.create'],
            config('permissions')['categories']['category.edit'],
            config('permissions')['categories']['category.delete'],
            
            config('permissions')['brands']['brand.list'],
            config('permissions')['brands']['brand.create'],
            config('permissions')['brands']['brand.edit'],
            config('permissions')['brands']['brand.delete'],
            
            config('permissions')['banners']['banner.list'],
            config('permissions')['banners']['banner.create'],
            config('permissions')['banners']['banner.edit'],
            config('permissions')['banners']['banner.delete'],

            config('permissions')['blogs']['blog.list'],
            config('permissions')['blogs']['blog.create'],
            config('permissions')['blogs']['blog.edit'],
            config('permissions')['blogs']['blog.delete'],

            config('permissions')['orders']['order.list'],
            config('permissions')['orders']['order.create'],
            config('permissions')['orders']['order.edit'],
            config('permissions')['orders']['order.delete'],

            config('permissions')['revenues']['revenue.list'],
            config('permissions')['revenues']['revenue.create'],
            config('permissions')['revenues']['revenue.edit'],
            config('permissions')['revenues']['revenue.delete'],

            config('permissions')['super_admin'],
            config('permissions')['develop'],

        ];

        foreach ($permissions as $index => $permission) {
            $moduleName = null;

            if ($index < 4) {
                $moduleName = config('constant.role_name.user');
            } elseif ($index < 8) {
                $moduleName = config('constant.role_name.role');
            } elseif ($index < 12) {
                $moduleName = config('constant.role_name.product');
            } elseif ($index < 16) {
                $moduleName = config('constant.role_name.category');
            } elseif ($index < 20) {
                $moduleName = config('constant.role_name.brand');
            } elseif ($index < 24) {
                $moduleName = config('constant.role_name.banner');
            } elseif ($index < 28) {
                $moduleName = config('constant.role_name.blog');
            } elseif ($index < 32) {
                $moduleName = config('constant.role_name.order');
            } elseif ($index < 36) {
                $moduleName = config('constant.role_name.revenue');
            } else {
                $moduleName = config('constant.role_name.user');
            }
            Permission::create(['name' => $permission, 'guard_name' => 'api', 'module_name' => $moduleName]);
        }

        $role = Role::find(config('constant')['super_admin_id']);
        $role->syncPermissions($permissions);

        $role = Role::find(config('constant')['develop_id']);
        $role->syncPermissions($permissions);
    }
}
