<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::get('profile', [AuthController::class, 'profile']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('logout-all', [AuthController::class, 'logoutAll']);
    });



    // Admin routes - require admin role
    Route::middleware(['role:admin,super-admin'])->group(function () {
        // User management
        Route::get('/users', [UserController::class, 'index'])->middleware('permission:view users');
        Route::get('/users/{user}', [UserController::class, 'show'])->middleware('permission:view users');
        Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole'])->middleware('permission:assign roles');
        Route::post('/users/{user}/remove-role', [UserController::class, 'removeRole'])->middleware('permission:remove roles');
        Route::post('/users/{user}/assign-permission', [UserController::class, 'assignPermission'])->middleware('permission:assign permissions');
        Route::post('/users/{user}/remove-permission', [UserController::class, 'removePermission'])->middleware('permission:remove permissions');
        Route::get('/users/{user}/permissions', [UserController::class, 'getUserPermissions'])->middleware('permission:view users');

        // Role management
        Route::get('/roles', [RoleController::class, 'index'])->middleware('permission:view roles');
        Route::post('/roles', [RoleController::class, 'store'])->middleware('permission:create roles');
        Route::get('/roles/{role}', [RoleController::class, 'show'])->middleware('permission:view roles');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->middleware('permission:edit roles');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:delete roles');
        Route::post('/roles/{role}/assign-permission', [RoleController::class, 'assignPermission'])->middleware('permission:edit roles');

        // Permission management
        Route::get('/permissions', [PermissionController::class, 'index'])->middleware('permission:view permissions');
        Route::post('/permissions', [PermissionController::class, 'store'])->middleware('permission:create permissions');
        Route::get('/permissions/{permission}', [PermissionController::class, 'show'])->middleware('permission:view permissions');
        Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit permissions');
        Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:delete permissions');
    });

    // Admin routes (super-admin only)
    Route::middleware('role:super-admin')->prefix('admin')->group(function () {
        // Additional admin-only routes can be added here
        Route::get('dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Welcome to admin dashboard',
                'data' => [
                    'user' => auth()->user()->load('roles.permissions')
                ]
            ]);
        });
    });
});

// Fallback route for API
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found'
    ], 404);
});