<?php
session_start();
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Invalid method'], 405);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    json_response(['success' => false, 'message' => 'Invalid JSON body'], 400);
}

$name     = trim($data['name'] ?? '');
$email    = trim($data['email'] ?? '');
$password = (string)($data['password'] ?? '');
$role     = $data['role'] ?? 'user';

if ($name === '' || $email === '' || $password === '') {
    json_response(['success' => false, 'message' => 'Name, email and password are required.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['success' => false, 'message' => 'Invalid email address.'], 400);
}

if (strlen($password) < 6) {
    json_response(['success' => false, 'message' => 'Password must be at least 6 characters.'], 400);
}

if (!in_array($role, ['user', 'worker'], true)) {
    $role = 'user';
}

try {
    $pdo = db();

    // check duplicate email
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_response(['success' => false, 'message' => 'Email is already registered.'], 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare('INSERT INTO users (role, name, email, password_hash) VALUES (?, ?, ?, ?)');
    $stmt->execute([$role, $name, $email, $hash]);

    $userId = (int)$pdo->lastInsertId();

    json_response([
        'success' => true,
        'user' => [
            'id'    => $userId,
            'name'  => $name,
            'email' => $email,
            'role'  => $role,
        ],
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => 'Server error while creating account.'], 500);
}

