<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ApiResponseCache
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $cacheDuration = 300): Response
    {
        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }
        
        $cacheKey = $this->getCacheKey($request);
        
        // Try to get cached response
        $cachedResponse = Cache::get($cacheKey);
        
        if ($cachedResponse) {
            Log::info('API response served from cache', [
                'cache_key' => $cacheKey,
                'endpoint' => $request->fullUrl()
            ]);
            
            return response($cachedResponse['content'], $cachedResponse['status'])
                ->withHeaders($cachedResponse['headers'])
                ->header('X-Cache-Status', 'HIT')
                ->header('X-Cache-Key', $cacheKey);
        }
        
        $response = $next($request);
        
        // Only cache successful responses
        if ($response->getStatusCode() === 200) {
            $cacheData = [
                'content' => $response->getContent(),
                'status' => $response->getStatusCode(),
                'headers' => $response->headers->all()
            ];
            
            Cache::put($cacheKey, $cacheData, $cacheDuration);
            
            Log::info('API response cached', [
                'cache_key' => $cacheKey,
                'endpoint' => $request->fullUrl(),
                'duration' => $cacheDuration
            ]);
        }
        
        return $response->header('X-Cache-Status', 'MISS')
                      ->header('X-Cache-Key', $cacheKey);
    }
    
    /**
     * Generate cache key for the request
     */
    protected function getCacheKey(Request $request): string
    {
        $userId = auth()->id();
        $path = $request->path();
        $queryParams = $request->query();
        
        // Sort query parameters for consistent cache keys
        ksort($queryParams);
        $queryString = http_build_query($queryParams);
        
        $baseKey = "api_cache:{$path}";
        
        if ($queryString) {
            $baseKey .= ":" . md5($queryString);
        }
        
        // Include user ID for user-specific responses
        if ($userId) {
            $baseKey .= ":user:{$userId}";
        }
        
        return $baseKey;
    }
}