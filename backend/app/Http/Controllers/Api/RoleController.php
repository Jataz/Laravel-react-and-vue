<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of roles
     */
    public function index()
    {
        // Cache roles for 30 minutes
        $roles = Cache::remember('roles_with_permissions', 1800, function () {
            return Role::with('permissions')->get();
        });

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    /**
     * Store a newly created role
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $role = Role::create(['name' => $request->name]);

        if ($request->has('permissions')) {
            $permissions = Permission::whereIn('id', $request->permissions)->get();
            $role->syncPermissions($permissions);
        }

        // Clear roles cache when new role is created
        Cache::forget('roles_with_permissions');
        
        // Log role creation
        Log::info('Role created', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'created_by' => auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully',
            'data' => $role->load('permissions')
        ], 201);
    }

    /**
     * Display the specified role
     */
    public function show($id)
    {
        // Cache individual role for 30 minutes
        $role = Cache::remember("role_with_permissions:{$id}", 1800, function () use ($id) {
            return Role::with('permissions')->find($id);
        });

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $role
        ]);
    }

    /**
     * Update the specified role
     */
    public function update(Request $request, $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:roles,name,' . $id,
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $role->update(['name' => $request->name]);

        if ($request->has('permissions')) {
            $permissions = Permission::whereIn('id', $request->permissions)->get();
            $role->syncPermissions($permissions);
        }

        // Clear caches when role is updated
        Cache::forget('roles_with_permissions');
        Cache::forget("role_with_permissions:{$id}");
        
        // Clear user caches for users with this role
        $this->clearUserCachesForRole($role);
        
        // Log role update
        Log::info('Role updated', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'updated_by' => auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully',
            'data' => $role->load('permissions')
        ]);
    }

    /**
     * Remove the specified role
     */
    public function destroy($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found'
            ], 404);
        }

        // Prevent deletion of super-admin role
        if ($role->name === 'super-admin') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete super-admin role'
            ], 403);
        }

        // Clear caches before deletion
        Cache::forget('roles_with_permissions');
        Cache::forget("role_with_permissions:{$id}");
        
        // Clear user caches for users with this role
        $this->clearUserCachesForRole($role);
        
        // Log role deletion
        Log::info('Role deleted', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'deleted_by' => auth()->id()
        ]);

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully'
        ]);
    }

    /**
     * Assign permissions to role
     */
    public function assignPermissions(Request $request, $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found'
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
        $role->syncPermissions($permissions);

        // Clear caches when permissions are assigned
        Cache::forget('roles_with_permissions');
        Cache::forget("role_with_permissions:{$id}");
        
        // Clear user caches for users with this role
        $this->clearUserCachesForRole($role);
        
        // Log permission assignment
        Log::info('Permissions assigned to role', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'permissions_count' => count($request->permissions),
            'assigned_by' => auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Permissions assigned successfully',
            'data' => $role->load('permissions')
        ]);
    }

    /**
     * Clear user caches for users with the specified role
     */
    private function clearUserCachesForRole($role)
    {
        // Get all users with this role and clear their caches
        $users = $role->users;
        foreach ($users as $user) {
            Cache::forget("user_profile:{$user->id}");
        }
    }
}
