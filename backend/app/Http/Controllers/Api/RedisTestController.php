<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Http\JsonResponse;

class RedisTestController extends Controller
{
    /**
     * Test Redis caching functionality
     */
    public function testCache(): JsonResponse
    {
        try {
            // Test basic caching
            $cacheKey = 'test_cache_' . time();
            $cacheValue = [
                'message' => 'Hello from Redis Cache!',
                'timestamp' => now()->toDateTimeString(),
                'random_number' => rand(1000, 9999)
            ];

            // Store in cache for 5 minutes
            Cache::put($cacheKey, $cacheValue, 300);

            // Retrieve from cache
            $retrievedValue = Cache::get($cacheKey);

            return response()->json([
                'success' => true,
                'message' => 'Redis cache test successful',
                'data' => [
                    'stored_value' => $cacheValue,
                    'retrieved_value' => $retrievedValue,
                    'cache_key' => $cacheKey
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Redis cache test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test Redis direct connection
     */
    public function testConnection(): JsonResponse
    {
        try {
            // Test direct Redis connection
            $redis = Redis::connection();
            
            // Set a test value
            $testKey = 'direct_test_' . time();
            $testValue = json_encode([
                'message' => 'Direct Redis connection test',
                'timestamp' => now()->toDateTimeString()
            ]);

            $redis->set($testKey, $testValue);
            $redis->expire($testKey, 300); // Expire in 5 minutes

            // Get the value back
            $retrievedValue = $redis->get($testKey);

            return response()->json([
                'success' => true,
                'message' => 'Redis direct connection test successful',
                'data' => [
                    'stored_value' => json_decode($testValue, true),
                    'retrieved_value' => json_decode($retrievedValue, true),
                    'redis_key' => $testKey
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Redis direct connection test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Redis server info
     */
    public function serverInfo(): JsonResponse
    {
        try {
            $redis = Redis::connection();
            $info = $redis->info();

            return response()->json([
                'success' => true,
                'message' => 'Redis server info retrieved',
                'data' => [
                    'redis_version' => $info['redis_version'] ?? 'Unknown',
                    'connected_clients' => $info['connected_clients'] ?? 'Unknown',
                    'used_memory_human' => $info['used_memory_human'] ?? 'Unknown',
                    'total_commands_processed' => $info['total_commands_processed'] ?? 'Unknown'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get Redis server info',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test Redis with API data caching
     */
    public function testApiCaching(Request $request): JsonResponse
    {
        try {
            $cacheKey = 'api_data_' . ($request->get('id', 'default'));
            
            // Check if data exists in cache
            $cachedData = Cache::get($cacheKey);
            
            if ($cachedData) {
                return response()->json([
                    'success' => true,
                    'message' => 'Data retrieved from Redis cache',
                    'data' => $cachedData,
                    'cached' => true,
                    'cache_key' => $cacheKey
                ]);
            }

            // Simulate API data processing
            $apiData = [
                'id' => $request->get('id', 'default'),
                'processed_at' => now()->toDateTimeString(),
                'data' => [
                    'users_count' => rand(100, 1000),
                    'active_sessions' => rand(10, 100),
                    'api_calls_today' => rand(1000, 10000)
                ],
                'processing_time_ms' => rand(50, 200)
            ];

            // Store in cache for 10 minutes
            Cache::put($cacheKey, $apiData, 600);

            return response()->json([
                'success' => true,
                'message' => 'Data processed and cached in Redis',
                'data' => $apiData,
                'cached' => false,
                'cache_key' => $cacheKey
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'API caching test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}