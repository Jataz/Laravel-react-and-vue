<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign default role (you can customize this)
        $user->assignRole('user');

        $token = $user->createToken('auth_token')->plainTextToken;

        // Cache user data with roles and permissions for 1 hour
        $userCacheKey = "user_profile:{$user->id}";
        $cachedUserData = Cache::remember($userCacheKey, 3600, function () use ($user) {
            return $user->load('roles.permissions');
        });

        // Log user registration
        Log::info('New user registered', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => $cachedUserData,
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $failedAttemptsKey = "failed_login_attempts:{$email}";
        
        // Check for rate limiting (max 5 attempts per 15 minutes)
        $failedAttempts = Cache::get($failedAttemptsKey, 0);
        if ($failedAttempts >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'Too many failed login attempts. Please try again later.'
            ], 429);
        }

        if (!Auth::guard('web')->attempt($request->only('email', 'password'))) {
            // Increment failed attempts
            Cache::put($failedAttemptsKey, $failedAttempts + 1, 900); // 15 minutes
            
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Clear failed attempts on successful login
        Cache::forget($failedAttemptsKey);

        $user = Auth::guard('web')->user();
        $token = $user->createToken('auth_token')->plainTextToken;

        // Cache user data with roles and permissions for 1 hour
        $userCacheKey = "user_profile:{$user->id}";
        $cachedUserData = Cache::remember($userCacheKey, 3600, function () use ($user) {
            return $user->load('roles.permissions');
        });

        // Log successful login
        Log::info('User logged in successfully', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $cachedUserData,
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    /**
     * Get authenticated user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $userCacheKey = "user_profile:{$user->id}";
        
        // Try to get user data from cache, if not found, load from database and cache it
        $cachedUserData = Cache::remember($userCacheKey, 3600, function () use ($user) {
            return $user->load('roles.permissions');
        });

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $cachedUserData
            ]
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        // Clear user cache on logout
        $userCacheKey = "user_profile:{$user->id}";
        Cache::forget($userCacheKey);

        // Log logout
        Log::info('User logged out', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Logout from all devices
     */
    public function logoutAll(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        // Clear user cache on logout from all devices
        $userCacheKey = "user_profile:{$user->id}";
        Cache::forget($userCacheKey);

        // Log logout from all devices
        Log::info('User logged out from all devices', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged out from all devices successfully'
        ]);
    }
}
