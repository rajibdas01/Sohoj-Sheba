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

$email    = trim($data['email'] ?? '');
$password = (string)($data['password'] ?? '');
$role     = $data['role'] ?? null;

if ($email === '' || $password === '') {
    json_response(['success' => false, 'message' => 'Email and password are required.'], 400);
}

// Reads worker fallback photo when users.profile_photo_path is empty.
function worker_photo_fallback(mysqli $conn, int $userId, ?string $currentPhoto): ?string
{
    if ($currentPhoto !== null && trim($currentPhoto) !== '') {
        return $currentPhoto;
    }
    $stmt = $conn->prepare('SELECT profile_photo_path FROM worker_profiles WHERE user_id = ? LIMIT 1');
    if (!$stmt) {
        return $currentPhoto;
    }
    $stmt->bind_param('i', $userId);
    if (!$stmt->execute()) {
        return $currentPhoto;
    }
    $result = $stmt->get_result();
    $row = $result ? $result->fetch_assoc() : null;
    return ($row && !empty($row['profile_photo_path'])) ? $row['profile_photo_path'] : $currentPhoto;
}

try {
    global $conn;

    $stmt = $conn->prepare('SELECT id, role, name, email, password_hash, profile_photo_path FROM users WHERE email = ? LIMIT 1');
    if (!$stmt) {
        throw new RuntimeException('Prepare failed');
    }
    $stmt->bind_param('s', $email);
    if (!$stmt->execute()) {
        throw new RuntimeException('Execute failed');
    }
    $result = $stmt->get_result();
    $user = $result ? $result->fetch_assoc() : null;

    if (!$user) {
        json_response(['success' => false, 'message' => 'Invalid email or password.'], 401);
    }

    if (!password_verify($password, (string)$user['password_hash'])) {
        json_response(['success' => false, 'message' => 'Invalid email or password.'], 401);
    }

    // Optional: ensure selected role matches stored role
    if ($role && in_array($role, ['user', 'worker'], true) && $user['role'] !== $role) {
        json_response(['success' => false, 'message' => 'Selected account type does not match this email.'], 403);
    }

    $photo = $user['profile_photo_path'] ?? null;
    if ($user['role'] === 'worker' && ($photo === null || $photo === '')) {
        $photo = worker_photo_fallback($conn, (int)$user['id'], $photo);
    }

    $_SESSION['user'] = [
        'id'                 => (int)$user['id'],
        'name'               => $user['name'],
        'email'              => $user['email'],
        'role'               => $user['role'],
        'profile_photo_path' => $photo,
    ];

    json_response([
        'success' => true,
        'user'    => $_SESSION['user'],
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => 'Server error while logging in.'], 500);
}

