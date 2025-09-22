<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RedisResponseCache
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, int $ttl = 300): Response
    {
        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        // Generate cache key based on URL and user
        $cacheKey = $this->generateCacheKey($request);
        
        Log::info('Redis Cache Middleware', [
            'url' => $request->fullUrl(),
            'cache_key' => $cacheKey,
            'ttl' => $ttl
        ]);

        try {
            // Try to get cached response
            $cachedResponse = Redis::get($cacheKey);
            
            if ($cachedResponse) {
                Log::info('Cache HIT', ['cache_key' => $cacheKey]);
                $data = json_decode($cachedResponse, true);
                
                return response()->json($data['content'], $data['status'])
                    ->withHeaders($data['headers'] ?? [])
                    ->header('X-Cache-Status', 'HIT');
            }

            Log::info('Cache MISS', ['cache_key' => $cacheKey]);
            
            // Get fresh response
            $response = $next($request);
            
            // Cache successful responses
            if ($response->getStatusCode() === 200) {
                $cacheData = [
                    'content' => json_decode($response->getContent(), true),
                    'status' => $response->getStatusCode(),
                    'headers' => $response->headers->all()
                ];
                
                Redis::setex($cacheKey, $ttl, json_encode($cacheData));
                Log::info('Response cached', ['cache_key' => $cacheKey, 'ttl' => $ttl]);
            }
            
            return $response->header('X-Cache-Status', 'MISS');
            
        } catch (\Exception $e) {
            Log::error('Redis cache error', [
                'error' => $e->getMessage(),
                'cache_key' => $cacheKey
            ]);
            
            return $next($request);
        }
    }

    /**
     * Generate cache key for the request
     */
    private function generateCacheKey(Request $request): string
    {
        $userId = auth()->id() ?? 'guest';
        $url = $request->fullUrl();
        
        return "api_cache:{$userId}:" . md5($url);
    }
}