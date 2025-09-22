<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index()
    {
        // Cache users with roles and permissions for 30 minutes
        $cacheKey = 'users_with_roles_permissions';
        $users = Cache::remember($cacheKey, 1800, function () {
            return User::with('roles.permissions')->get();
        });

        Log::info('Users list retrieved', ['cache_key' => $cacheKey, 'count' => $users->count()]);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        // Cache individual user with roles and permissions for 30 minutes
        $cacheKey = "user_with_roles_permissions:{$id}";
        $user = Cache::remember($cacheKey, 1800, function () use ($id) {
            return User::with('roles.permissions')->find($id);
        });

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        Log::info('User details retrieved', ['user_id' => $id, 'cache_key' => $cacheKey]);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Assign roles to user
     */
    public function assignRoles(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $roles = Role::whereIn('id', $request->roles)->get();
        $user->syncRoles($roles);

        // Clear related caches
        Cache::forget('users_with_roles_permissions');
        Cache::forget("user_with_roles_permissions:{$id}");
        Cache::forget("user_profile:{$id}");

        Log::info('User roles assigned', ['user_id' => $id, 'roles' => $request->roles]);

        return response()->json([
            'success' => true,
            'message' => 'Roles assigned successfully',
            'data' => $user->load('roles.permissions')
        ]);
    }

    /**
     * Assign permissions directly to user
     */
    public function assignPermissions(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $permissions = Permission::whereIn('id', $request->permissions)->get();
        $user->syncPermissions($permissions);

        // Clear related caches
        Cache::forget('users_with_roles_permissions');
        Cache::forget("user_with_roles_permissions:{$id}");
        Cache::forget("user_profile:{$id}");

        Log::info('User permissions assigned', ['user_id' => $id, 'permissions' => $request->permissions]);

        return response()->json([
            'success' => true,
            'message' => 'Permissions assigned successfully',
            'data' => $user->load('roles.permissions', 'permissions')
        ]);
    }

    /**
     * Remove roles from user
     */
    public function removeRoles(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $roles = Role::whereIn('id', $request->roles)->pluck('name');
        $user->removeRole($roles);

        return response()->json([
            'success' => true,
            'message' => 'Roles removed successfully',
            'data' => $user->load('roles.permissions')
        ]);
    }

    /**
     * Remove permissions from user
     */
    public function removePermissions(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $permissions = Permission::whereIn('id', $request->permissions)->pluck('name');
        $user->revokePermissionTo($permissions);

        return response()->json([
            'success' => true,
            'message' => 'Permissions removed successfully',
            'data' => $user->load('roles.permissions', 'permissions')
        ]);
    }

    /**
     * Get user permissions (including role permissions)
     */
    public function getUserPermissions($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $allPermissions = $user->getAllPermissions();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->load('roles'),
                'permissions' => $allPermissions
            ]
        ]);
    }
}
