# Redis Installation Guide for Windows

## Current Issue
Your Laravel application is configured to use Redis, but Redis server is not running on your Windows machine. This causes the connection error:
```
Predis\Connection\Resource\Exception\StreamInitException 
No connection could be made because the target machine actively refused it [tcp://127.0.0.1:6379]
```

## Installation Methods

### Method 1: Docker (Recommended - Easiest)

**Prerequisites:** Docker Desktop must be installed and running.

1. **Start Docker Desktop:**
   - Open Docker Desktop from Start Menu
   - Wait for it to fully start (Docker icon in system tray should be green)

2. **Run Redis in Docker:**
   ```powershell
   # Pull and run Redis container
   docker run -d --name redis-server -p 6379:6379 redis:latest
   
   # Verify it's running
   docker ps
   
   # Test Redis connection
   docker exec -it redis-server redis-cli ping
   # Should return: PONG
   ```

3. **Stop/Start Redis when needed:**
   ```powershell
   # Stop Redis
   docker stop redis-server
   
   # Start Redis again
   docker start redis-server
   
   # Remove container (if needed)
   docker rm redis-server
   ```

## Alternative Installation Methods

### Method 1: Easiest Manual Installation (Recommended)

1. **Download Redis for Windows:**
   - Open your browser and go to: https://github.com/tporadowski/redis/releases
   - Download the latest `Redis-x64-*.zip` file (e.g., `Redis-x64-5.0.14.1.zip`)
   - Extract the ZIP file to `C:\Redis\`

2. **Start Redis:**
   ```powershell
   # Navigate to Redis directory
   cd C:\Redis
   
   # Start Redis server
   .\redis-server.exe
   ```

3. **Test Redis (in another terminal):**
   ```powershell
   # Navigate to Redis directory
   cd C:\Redis
   
   # Test connection
   .\redis-cli.exe ping
   # Should return: PONG
   ```

### Method 2: Download Redis for Windows (MSI Installer)

1. **Download Redis for Windows:**
   - Go to: https://github.com/microsoftarchive/redis/releases
   - Download the latest `.msi` file (e.g., `Redis-x64-3.0.504.msi`)
   - Run the installer as Administrator

2. **Installation Steps:**
   - Run the downloaded `.msi` file
   - Follow the installation wizard
   - Choose "Add Redis to PATH" option
   - Install Redis as a Windows Service (recommended)

3. **Start Redis Service:**
   ```powershell
   # Start Redis service
   net start redis
   
   # Or using Services.msc
   # Press Win+R, type "services.msc", find "Redis" and start it
   ```

### Method 2: Using WSL (Windows Subsystem for Linux)

If you have WSL installed:

1. **Open WSL terminal:**
   ```bash
   wsl
   ```

2. **Install Redis in WSL:**
   ```bash
   sudo apt update
   sudo apt install redis-server
   ```

3. **Start Redis in WSL:**
   ```bash
   sudo service redis-server start
   ```

4. **Make Redis accessible from Windows:**
   ```bash
   # Edit Redis config to bind to all interfaces
   sudo nano /etc/redis/redis.conf
   
   # Find and change:
   # bind 127.0.0.1 ::1
   # to:
   # bind 0.0.0.0
   
   # Restart Redis
   sudo service redis-server restart
   ```

### Method 3: Using Docker Desktop

1. **Install Docker Desktop for Windows:**
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and restart your computer

2. **Run Redis in Docker:**
   ```powershell
   docker run -d --name redis-server -p 6379:6379 redis:latest
   ```

### Method 4: Portable Redis (Quick Setup)

1. **Download Memurai (Redis-compatible):**
   - Go to: https://www.memurai.com/
   - Download the free developer edition
   - Install and it will run as a Windows service

## After Installation - Testing

### Test Redis Connection
```powershell
# Test if Redis is running on port 6379
telnet localhost 6379

# Or use PowerShell
Test-NetConnection -ComputerName localhost -Port 6379
```

### Test with Redis CLI
```powershell
# If Redis CLI is installed
redis-cli ping
# Should return: PONG
```

## Laravel Testing

Once Redis is running, test your Laravel application:

```powershell
# Clear Laravel config cache
php artisan config:clear

# Test Redis connection
php artisan tinker --execute="Cache::put('test', 'Hello Redis'); echo Cache::get('test');"
```

## Troubleshooting

### Common Issues:

1. **Port 6379 already in use:**
   ```powershell
   netstat -an | findstr :6379
   ```

2. **Redis service not starting:**
   - Check Windows Event Viewer
   - Run Command Prompt as Administrator
   - Try: `net start redis`

3. **Firewall blocking connection:**
   - Add Redis to Windows Firewall exceptions
   - Allow port 6379 in Windows Firewall

### Redis Configuration

Default Redis config location (Windows):
- `C:\Program Files\Redis\redis.windows.conf`

Key settings to verify:
```
port 6379
bind 127.0.0.1
timeout 0
```

## Next Steps

1. Choose one of the installation methods above
2. Install and start Redis
3. Test the connection
4. Run your Laravel application
5. Test the Redis integration endpoints we created

## Quick Start Commands

After Redis is installed and running:

```powershell
# Navigate to your Laravel project
cd C:\Users\africa.jatakalula\lara-backend\backend

# Clear config cache
php artisan config:clear

# Test Redis endpoints
# GET http://127.0.0.1:8000/api/redis/test-connection
# GET http://127.0.0.1:8000/api/redis/test-cache
# GET http://127.0.0.1:8000/api/redis/server-info
```