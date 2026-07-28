<?php
require __DIR__ . '/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

if (!tx_rate_limit('contact', 8, 3600)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests. Please try again shortly, or call/WhatsApp Bernard.']);
    exit;
}

function clean_line($value) {
    return trim(str_replace(["\r", "\n"], '', $value));
}

// Honeypot: real users never fill this hidden field.
if (isset($_POST['company']) && clean_line($_POST['company']) !== '') {
    echo json_encode(['success' => true]);
    exit;
}

$name    = isset($_POST['name']) ? clean_line($_POST['name']) : '';
$email   = isset($_POST['email']) ? clean_line($_POST['email']) : '';
$message = isset($_POST['message']) ? mb_substr(trim($_POST['message']), 0, 700) : '';
$consent = isset($_POST['consent']) && $_POST['consent'] === '1';

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$consent) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please fill in all required fields with a valid email, and accept the GDPR agreement.']);
    exit;
}

$c = tx_config();
$subject = 'Contact form message from ' . $name . ' (taxivodice.hr)';

$body  = "New contact form submission from taxivodice.hr\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n\n";
$body .= "Message:\n$message\n";

$headers   = [];
$headers[] = 'From: TAXI Bernard Website <' . $c['mail_from'] . '>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();

$sent = mail($c['admin_email'], $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not send message. Please call or WhatsApp Bernard instead.']);
}
