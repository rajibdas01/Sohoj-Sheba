<?php
session_start();
require_once __DIR__ . '/db.php';

$user = $_SESSION['user'] ?? null;
if (!$user) {
    json_response(['success' => false, 'message' => 'Not authenticated'], 401);
}

try {
    $pdo = db();

    // Fetch full user row
    $stmt = $pdo->prepare(
        'SELECT id, role, name, email, phone, whatsapp, alternative_phone,
                country, city, area, postal_code, address,
                date_of_birth, gender,
                preferred_language, referral_source, preferences_text,
                newsletter_opt_in, terms_accepted_at, created_at
         FROM users WHERE id = ? LIMIT 1'
    );
    $stmt->execute([$user['id']]);
    $row = $stmt->fetch();

    if (!$row) {
        json_response(['success' => false, 'message' => 'User not found'], 404);
    }

    $profile = [
        'id'                 => (int)$row['id'],
        'role'               => $row['role'],
        'name'               => $row['name'],
        'email'              => $row['email'],
        'phone'              => $row['phone'],
        'whatsapp'           => $row['whatsapp'],
        'alternative_phone'  => $row['alternative_phone'],
        'country'            => $row['country'],
        'city'               => $row['city'],
        'area'               => $row['area'],
        'postal_code'        => $row['postal_code'],
        'address'            => $row['address'],
        'date_of_birth'      => $row['date_of_birth'],
        'gender'             => $row['gender'],
        'preferred_language' => $row['preferred_language'],
        'referral_source'    => $row['referral_source'],
        'preferences_text'   => $row['preferences_text'],
        'newsletter_opt_in'  => (bool)$row['newsletter_opt_in'],
        'member_since'       => $row['created_at'],
    ];

    // Worker: also fetch worker_profiles + services
    if ($row['role'] === 'worker') {
        $wStmt = $pdo->prepare(
            'SELECT experience, skills, nid_number, trade_license,
                    profile_photo_path, rating_avg, jobs_completed
             FROM worker_profiles WHERE user_id = ? LIMIT 1'
        );
        $wStmt->execute([$user['id']]);
        $wp = $wStmt->fetch();

        if ($wp) {
            $profile['experience']          = $wp['experience'];
            $profile['skills']              = $wp['skills'];
            $profile['nid_number']          = $wp['nid_number'];
            $profile['trade_license']       = $wp['trade_license'];
            $profile['profile_photo_path']  = $wp['profile_photo_path'];
            $profile['rating_avg']          = (float)$wp['rating_avg'];
            $profile['jobs_completed']      = (int)$wp['jobs_completed'];
        }

        // Fetch service names the worker offers
        $sStmt = $pdo->prepare(
            'SELECT s.name FROM services s
             INNER JOIN worker_services ws ON ws.service_id = s.id
             WHERE ws.worker_user_id = ?'
        );
        $sStmt->execute([$user['id']]);
        $profile['services'] = array_column($sStmt->fetchAll(), 'name');
    }

    json_response(['success' => true, 'profile' => $profile]);

} catch (Throwable $e) {
    json_response(['success' => false, 'message' => 'Server error loading profile.'], 500);
}