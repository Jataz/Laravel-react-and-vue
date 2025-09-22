# Redis Setup and Usage Guide

## Overview
Redis has been successfully integrated into your Laravel API application for caching, sessions, and queues.

## What's Been Configured

### 1. Dependencies Installed
- ✅ **Predis/Predis** - Pure PHP Redis client (v3.2.0)

### 2. Configuration Files Updated
- ✅ **config/database.php** - Redis client set to 'predis'
- ✅ **config/cache.php** - Redis cache store configured
- ✅ **config/session.php** - Redis session driver ready
- ✅ **config/queue.php** - Redis queue driver configured

### 3. Environment Variables (.env)
```env
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## Installing Redis Server

### For Windows:
1. **Download Redis for Windows:**
   - Visit: https://github.com/microsoftarchive/redis/releases
   - Download the latest .msi file
   - Install and start the Redis service

2. **Alternative - Using Docker:**
   ```bash
   docker run -d -p 6379:6379 --name redis redis:latest
   ```

3. **Using Windows Subsystem for Linux (WSL):**
   ```bash
   sudo apt update
   sudo apt install redis-server
   sudo service redis-server start
   ```

### For macOS:
```bash
brew install redis
brew services start redis
```

### For Linux:
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## Testing Redis Integration

### API Endpoints for Testing
Once Redis server is running, you can test the integration using these endpoints:

1. **Test Cache Functionality:**
   ```
   GET /api/redis/test-cache
   ```

2. **Test Direct Redis Connection:**
   ```
   GET /api/redis/test-connection
   ```

3. **Get Redis Server Info:**
   ```
   GET /api/redis/server-info
   ```

4. **Test API Data Caching:**
   ```
   GET /api/redis/test-api-caching?id=123
   ```

### Example Usage in Your Controllers

#### Basic Caching:
```php
use Illuminate\Support\Facades\Cache;

// Store data in cache
Cache::put('user_data_' . $userId, $userData, 3600); // 1 hour

// Retrieve from cache
$userData = Cache::get('user_data_' . $userId);

// Cache with fallback
$userData = Cache::remember('user_data_' . $userId, 3600, function () use ($userId) {
    return User::find($userId);
});
```

#### Direct Redis Usage:
```php
use Illuminate\Support\Facades\Redis;

// Set value
Redis::set('key', 'value');
Redis::expire('key', 3600);

// Get value
$value = Redis::get('key');

// Lists
Redis::lpush('queue', 'item1');
$item = Redis::rpop('queue');
```

#### Queue Jobs:
```php
// Dispatch job to Redis queue
dispatch(new ProcessUserData($user));

// Run queue worker
php artisan queue:work redis
```

## Performance Benefits

### 1. **Caching**
- Database query results
- API responses
- Computed data
- Session data

### 2. **Sessions**
- Faster session storage
- Shared sessions across multiple servers
- Better scalability

### 3. **Queues**
- Asynchronous job processing
- Better performance than database queues
- Real-time job monitoring

## Monitoring Redis

### Check Redis Status:
```bash
redis-cli ping
# Should return: PONG
```

### Monitor Redis Commands:
```bash
redis-cli monitor
```

### Check Memory Usage:
```bash
redis-cli info memory
```

## Common Redis Commands

```bash
# Connect to Redis CLI
redis-cli

# List all keys
KEYS *

# Get value
GET key_name

# Set value with expiration
SETEX key_name 3600 "value"

# Delete key
DEL key_name

# Clear all data
FLUSHALL
```

## Troubleshooting

### Connection Refused Error:
- Ensure Redis server is running
- Check if port 6379 is available
- Verify Redis configuration

### Permission Errors:
- Check Redis server permissions
- Ensure Laravel can write to Redis

### Memory Issues:
- Monitor Redis memory usage
- Set appropriate cache expiration times
- Configure Redis maxmemory settings

## Next Steps

1. **Install Redis Server** on your system
2. **Start Redis Service**
3. **Test the API endpoints** to verify integration
4. **Implement caching** in your existing controllers
5. **Set up queue workers** for background processing

Your Laravel application is now fully configured to use Redis for improved performance and scalability!