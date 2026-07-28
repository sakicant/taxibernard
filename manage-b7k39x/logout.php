<?php
require __DIR__ . '/auth.php';
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}
session_destroy();
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Logged out | TAXI Bernard Admin</title>
<link rel="stylesheet" href="admin.css">
</head>
<body class="admin-login-page">
  <div class="admin-card admin-login">
    <h1>Logged out</h1>
    <p>Your admin session was cleared. Since this area uses your browser's saved login, close this tab (or your browser) to fully sign out, or just reopen the <a href="index.php">bookings page</a> to sign back in.</p>
  </div>
</body>
</html>
