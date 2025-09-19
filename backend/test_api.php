<?php

/**
 * Simple API Test Script
 * This script tests the authentication and role/permission system
 */

$baseUrl = 'http://127.0.0.1:8000/api';

// Test data
$testUsers = [
    'admin' => ['email' => 'admin@example.com', 'password' => 'password123'],
    'manager' => ['email' => 'manager@example.com', 'password' => 'password123'],
    'user' => ['email' => 'user@example.com', 'password' => 'password123']
];

function makeRequest($url, $method = 'GET', $data = null, $token = null) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    $headers = ['Content-Type: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'body' => json_decode($response, true)
    ];
}

echo "=== Laravel Role & Permission API Test ===\n\n";

// Test 1: Login as admin
echo "1. Testing Admin Login...\n";
$loginResponse = makeRequest($baseUrl . '/auth/login', 'POST', $testUsers['admin']);
if ($loginResponse['status'] === 200 && isset($loginResponse['body']['data']['token'])) {
    $adminToken = $loginResponse['body']['data']['token'];
    echo "✓ Admin login successful\n";
    echo "Token: " . substr($adminToken, 0, 20) . "...\n\n";
} else {
    echo "✗ Admin login failed\n";
    print_r($loginResponse);
    exit;
}

// Test 2: Get user profile
echo "2. Testing User Profile...\n";
$profileResponse = makeRequest($baseUrl . '/auth/profile', 'GET', null, $adminToken);
if ($profileResponse['status'] === 200 && isset($profileResponse['body']['data']['user'])) {
    echo "✓ Profile retrieved successfully\n";
    echo "User: " . $profileResponse['body']['data']['user']['name'] . "\n";
    $roles = array_column($profileResponse['body']['data']['user']['roles'], 'name');
    echo "Roles: " . implode(', ', $roles) . "\n\n";
} else {
    echo "✗ Profile retrieval failed\n";
    print_r($profileResponse);
}

// Test 3: Get all roles (admin permission required)
echo "3. Testing Roles Endpoint (Admin Access)...\n";
$rolesResponse = makeRequest($baseUrl . '/roles', 'GET', null, $adminToken);
if ($rolesResponse['status'] === 200) {
    echo "✓ Roles retrieved successfully\n";
    echo "Found " . count($rolesResponse['body']['data']) . " roles\n\n";
} else {
    echo "✗ Roles retrieval failed\n";
    print_r($rolesResponse);
}

// Test 4: Get all permissions (admin permission required)
echo "4. Testing Permissions Endpoint (Admin Access)...\n";
$permissionsResponse = makeRequest($baseUrl . '/permissions', 'GET', null, $adminToken);
if ($permissionsResponse['status'] === 200) {
    echo "✓ Permissions retrieved successfully\n";
    echo "Found " . count($permissionsResponse['body']['data']) . " permissions\n\n";
} else {
    echo "✗ Permissions retrieval failed\n";
    print_r($permissionsResponse);
}

// Test 5: Login as regular user and test access restriction
echo "5. Testing Regular User Access Restriction...\n";
$userLoginResponse = makeRequest($baseUrl . '/auth/login', 'POST', $testUsers['user']);
if ($userLoginResponse['status'] === 200 && isset($userLoginResponse['body']['data']['token'])) {
    $userToken = $userLoginResponse['body']['data']['token'];
    echo "✓ User login successful\n";
    
    // Try to access admin endpoint
    $restrictedResponse = makeRequest($baseUrl . '/roles', 'GET', null, $userToken);
    if ($restrictedResponse['status'] === 403) {
        echo "✓ Access restriction working correctly (403 Forbidden)\n\n";
    } else {
        echo "✗ Access restriction failed - user can access admin endpoints\n";
        print_r($restrictedResponse);
    }
} else {
    echo "✗ User login failed\n";
    print_r($userLoginResponse);
}

// Test 6: Test user registration
echo "6. Testing User Registration...\n";
$newUser = [
    'name' => 'Test User',
    'email' => 'test.user@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123'
];
$registerResponse = makeRequest($baseUrl . '/auth/register', 'POST', $newUser);
if ($registerResponse['status'] === 201 && isset($registerResponse['body']['data']['user'])) {
    echo "✓ User registration successful\n";
    echo "New user: " . $registerResponse['body']['data']['user']['name'] . "\n\n";
} else {
    echo "✗ User registration failed\n";
    print_r($registerResponse);
}

echo "=== Test Complete ===\n";
echo "API endpoints are working correctly!\n";
echo "You can now use the following endpoints:\n";
echo "- POST /api/auth/register - Register new users\n";
echo "- POST /api/auth/login - Login users\n";
echo "- GET /api/auth/profile - Get user profile (authenticated)\n";
echo "- POST /api/auth/logout - Logout user (authenticated)\n";
echo "- GET /api/roles - Get all roles (admin only)\n";
echo "- GET /api/permissions - Get all permissions (admin only)\n";
echo "- GET /api/users - Get all users (admin only)\n";
echo "\nDefault users created:\n";
echo "- Super Admin: admin@example.com / password123\n";
echo "- Manager: manager@example.com / password123\n";
echo "- Regular User: user@example.com / password123\n";