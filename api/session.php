<?php
session_start();
require_once __DIR__ . '/db.php';

$user = $_SESSION['user'] ?? null;

if (!$user) {
    json_response(['loggedIn' => false]);
}

json_response([
    'loggedIn' => true,
    'user'     => $user,
]);

