<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management permissions
            'view users',
            'create users',
            'edit users',
            'delete users',
            'assign roles',
            'remove roles',
            'assign permissions',
            'remove permissions',

            // Role management permissions
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',

            // Permission management permissions
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',

            // Content management permissions
            'view content',
            'create content',
            'edit content',
            'delete content',
            'publish content',

            // System permissions
            'access admin panel',
            'view reports',
            'manage settings',
            'view logs',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Super Admin - has all permissions
        $superAdminRole = Role::create(['name' => 'super-admin']);
        $superAdminRole->givePermissionTo(Permission::all());

        // Admin - has most permissions except super admin specific ones
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'view users', 'create users', 'edit users', 'assign roles', 'remove roles',
            'view roles', 'create roles', 'edit roles',
            'view permissions',
            'view content', 'create content', 'edit content', 'delete content', 'publish content',
            'access admin panel', 'view reports', 'manage settings'
        ]);

        // Manager - has content and user management permissions
        $managerRole = Role::create(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'view users', 'edit users',
            'view roles',
            'view content', 'create content', 'edit content', 'publish content',
            'view reports'
        ]);

        // Editor - has content management permissions
        $editorRole = Role::create(['name' => 'editor']);
        $editorRole->givePermissionTo([
            'view content', 'create content', 'edit content'
        ]);

        // User - basic permissions
        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo([
            'view content'
        ]);

        // Create a super admin user
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('super-admin');

        // Create a regular admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin.user@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Create a manager user
        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $manager->assignRole('manager');

        // Create an editor user
        $editor = User::create([
            'name' => 'Editor User',
            'email' => 'editor@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $editor->assignRole('editor');

        // Create a regular user
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $user->assignRole('user');

        $this->command->info('Roles and permissions seeded successfully!');
        $this->command->info('Default users created:');
        $this->command->info('Super Admin: admin@example.com / password123');
        $this->command->info('Admin: admin.user@example.com / password123');
        $this->command->info('Manager: manager@example.com / password123');
        $this->command->info('Editor: editor@example.com / password123');
        $this->command->info('User: user@example.com / password123');
    }
}
