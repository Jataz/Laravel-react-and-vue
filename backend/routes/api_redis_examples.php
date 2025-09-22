<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;

/*
|--------------------------------------------------------------------------
| Redis-Enhanced API Routes Examples
|--------------------------------------------------------------------------
|
| These routes demonstrate how to use the Redis-based middleware
| for rate limiting and response caching in your API endpoints.
|
*/

// Example: User routes with Redis rate limiting and caching
Route::middleware(['auth:sanctum', 'redis.rate.limit', 'api.cache'])->group(function () {
    
    // User management routes with caching and rate limiting
    Route::get('/users', [UserController::class, 'index'])
        ->name('users.index');
    
    Route::get('/users/{id}', [UserController::class, 'show'])
        ->name('users.show');
    
    // Role management routes with caching
    Route::get('/roles', [RoleController::class, 'index'])
        ->name('roles.index');
    
    Route::get('/roles/{id}', [RoleController::class, 'show'])
        ->name('roles.show');
    
    // Permission routes with caching
    Route::get('/permissions', [PermissionController::class, 'index'])
        ->name('permissions.index');
});

// Example: High-traffic routes with stricter rate limiting
Route::middleware(['auth:sanctum', 'redis.rate.limit:30,1'])->group(function () {
    
    // User role assignment (limited to 30 requests per minute)
    Route::post('/users/{id}/assign-roles', [UserController::class, 'assignRoles'])
        ->name('users.assign-roles');
    
    Route::post('/users/{id}/assign-permissions', [UserController::class, 'assignPermissions'])
        ->name('users.assign-permissions');
});

// Example: Admin routes with custom rate limiting and no caching
Route::middleware(['auth:sanctum', 'role:admin', 'redis.rate.limit:100,1'])->group(function () {
    
    // Role management (admin only, 100 requests per minute)
    Route::post('/roles', [RoleController::class, 'store'])
        ->name('roles.store');
    
    Route::put('/roles/{id}', [RoleController::class, 'update'])
        ->name('roles.update');
    
    Route::delete('/roles/{id}', [RoleController::class, 'destroy'])
        ->name('roles.destroy');
    
    // Permission management
    Route::post('/permissions', [PermissionController::class, 'store'])
        ->name('permissions.store');
});

// Example: Public routes with basic rate limiting
Route::middleware(['redis.rate.limit:10,1'])->group(function () {
    
    // Public endpoints (10 requests per minute for unauthenticated users)
    Route::get('/public/roles', [RoleController::class, 'index'])
        ->name('public.roles');
    
    Route::get('/public/permissions', [PermissionController::class, 'index'])
        ->name('public.permissions');
});

/*
|--------------------------------------------------------------------------
| Middleware Usage Examples
|--------------------------------------------------------------------------
|
| 1. redis.rate.limit - Default: 60 requests per minute
|    redis.rate.limit:30,1 - 30 requests per minute
|    redis.rate.limit:100,5 - 100 requests per 5 minutes
|
| 2. api.cache - Caches GET requests for 5 minutes by default
|    Only caches successful responses (200 status)
|    Automatically includes user context in cache key
|
| 3. Combined usage:
|    Route::middleware(['auth:sanctum', 'redis.rate.limit:50,1', 'api.cache'])
|
|--------------------------------------------------------------------------
| Redis Configuration Notes
|--------------------------------------------------------------------------
|
| 1. Session Management:
|    Set SESSION_DRIVER=redis in .env for Redis-based sessions
|
| 2. Queue Management:
|    Set QUEUE_CONNECTION=redis in .env for Redis-based queues
|    Run: php artisan queue:work redis --queue=emails
|
| 3. Cache Management:
|    Set CACHE_DRIVER=redis in .env for Redis-based caching
|
|--------------------------------------------------------------------------
*/