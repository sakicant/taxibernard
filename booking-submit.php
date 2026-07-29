<?php
/**
 * Public endpoint that receives a booking from the quote widget, stores it
 * in the database, and emails Bernard + the customer.
 * Returns JSON so the front-end fetch() keeps working.
 */

require __DIR__ . '/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Throttle abuse: at most 6 booking submissions per IP per hour.
if (!tx_rate_limit('booking', 6, 3600)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests. Please try again shortly, or call/WhatsApp Bernard.']);
    exit;
}

function field($key, $max = 255)
{
    $v = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
    $v = str_replace(["\r", "\n", "\0"], ' ', $v);
    return mb_substr($v, 0, $max);
}

// Honeypot: real users never fill this hidden field.
if (field('company') !== '') {
    echo json_encode(['success' => true]);
    exit;
}

$pickup      = field('pickup', 120);
$dropoff     = field('dropoff', 120);
$trip        = field('trip', 20) === 'return' ? 'return' : 'oneway';
$pickupDate  = field('pickup_date', 20);
$pickupTime  = field('pickup_time', 20);
$returnDate  = field('return_date', 20);
$returnTime  = field('return_time', 20);
$passengers  = (int) field('passengers', 3);
$luggage     = (int) field('luggage', 3);
$price       = field('price', 40);
$name        = field('name', 120);
$email       = field('email', 160);
$phone       = field('phone', 60);
$flight      = field('flight', 120);
$dropoffDet  = field('dropoff_details', 120);
$notes       = isset($_POST['notes']) ? mb_substr(trim((string) $_POST['notes']), 0, 2000) : '';

$errors = [];
if ($pickup === '' || $dropoff === '') $errors[] = 'pickup and destination';
if ($name === '') $errors[] = 'your name';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'a valid email';
if ($phone === '') $errors[] = 'a phone number';
if ($pickupDate === '') $errors[] = 'pickup date';
if ($pickupTime === '') $errors[] = 'pickup time';

if ($errors) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide ' . implode(', ', $errors) . '.']);
    exit;
}

// The submitted price arrives as a plain URL/form field, anyone can edit
// ?price=115 down to ?price=1 by hand before hitting submit. Never trust it:
// look up what this exact route actually costs and use that instead. Only
// a numeric price makes a monetary claim worth checking, 'meter' and
// 'custom' (or anything else non-numeric) carry no number to fake and pass
// through as-is.
function official_price($from, $to)
{
    static $prices = null;
    if ($prices === null) {
        $prices = require __DIR__ . '/prices.php';
    }
    $from = trim($from);
    $to = trim($to);
    if (strcasecmp($from, 'Vodice') === 0 && isset($prices[$to])) return $prices[$to];
    if (strcasecmp($to, 'Vodice') === 0 && isset($prices[$from])) return $prices[$from];
    return null;
}

if (ctype_digit($price)) {
    $official = official_price($pickup, $dropoff);
    $expected = $official !== null ? ($trip === 'return' ? $official * 2 : $official) : null;
    if ($expected === null || (int) $price !== $expected) {
        $price = $expected !== null ? (string) $expected : 'custom';
    }
}

// Bernard's Renault Espace seats up to 6 passengers plus the driver.
$passengers = max(1, min(6, $passengers));
$luggage    = max(0, min(9, $luggage));

// Normalise date/time to NULL when empty so MySQL accepts them.
$nn = function ($v) { return $v === '' ? null : $v; };

try {
    $stmt = tx_db()->prepare(
        'INSERT INTO bookings
         (created_at, pickup, dropoff, trip_type, pickup_date, pickup_time,
          return_date, return_time, passengers, luggage, quoted_price,
          customer_name, customer_email, customer_phone, flight, dropoff_details, notes)
         VALUES
         (NOW(), :pickup, :dropoff, :trip, :pdate, :ptime,
          :rdate, :rtime, :pax, :lug, :price,
          :name, :email, :phone, :flight, :dropoff_details, :notes)'
    );
    $stmt->execute([
        ':pickup' => $pickup,
        ':dropoff' => $dropoff,
        ':trip' => $trip,
        ':pdate' => $nn($pickupDate),
        ':ptime' => $nn($pickupTime),
        ':rdate' => $nn($returnDate),
        ':rtime' => $nn($returnTime),
        ':pax' => $passengers,
        ':lug' => $luggage,
        ':price' => $nn($price),
        ':name' => $name,
        ':email' => $email,
        ':phone' => $nn($phone),
        ':flight' => $nn($flight),
        ':dropoff_details' => $nn($dropoffDet),
        ':notes' => $notes === '' ? null : $notes,
    ]);
    $id = tx_db()->lastInsertId();
} catch (PDOException $e) {
    http_response_code(500);
    error_log('Booking insert failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Could not save your booking. Please call or WhatsApp Bernard instead.']);
    exit;
}

// Build a readable summary for the emails.
$lines = [
    "Route: {$pickup} -> {$dropoff}",
    'Trip: ' . ($trip === 'return' ? 'Return' : 'One way'),
    "Pickup: {$pickupDate} {$pickupTime}",
];
if ($trip === 'return') {
    $lines[] = 'Return: ' . ($returnDate !== '' ? $returnDate : 'not set') . ' ' . $returnTime;
}
$lines[] = "Passengers: {$passengers}   Luggage: {$luggage}";
$lines[] = 'Quoted price: ' . ($price !== '' ? '€' . $price : 'custom');
$lines[] = "Name: {$name}";
$lines[] = "Email: {$email}";
$lines[] = "Phone: {$phone}";
if ($flight !== '') $lines[] = "Flight / pickup details: {$flight}";
if ($dropoffDet !== '') $lines[] = "Destination details: {$dropoffDet}";
if ($notes !== '') $lines[] = "Notes: {$notes}";
$summary = implode("\n", $lines);

$c = tx_config();
$headers = 'From: TAXI Bernard <' . $c['mail_from'] . ">\r\n" .
           'Reply-To: ' . $email . "\r\n" .
           "Content-Type: text/plain; charset=utf-8\r\n";

// Notify Bernard.
@mail(
    $c['admin_email'],
    'New booking #' . $id . ': ' . $pickup . ' to ' . $dropoff,
    "New booking request (#{$id}) from taxivodice.hr:\n\n{$summary}\n\nManage it in the admin dashboard.",
    $headers
);

// Acknowledge the customer. No advance payment is required, so this simply
// confirms receipt, matching Bernard's actual booking terms.
$custHeaders = 'From: TAXI Bernard <' . $c['mail_from'] . ">\r\n" .
               'Reply-To: ' . $c['admin_email'] . "\r\n" .
               "Content-Type: text/plain; charset=utf-8\r\n";
@mail(
    $email,
    'Your TAXI Bernard booking request (#' . $id . ')',
    "Hi {$name},\n\nThank you for your booking request. I will confirm it directly by phone, WhatsApp or email shortly, usually within a few hours. No advance payment is needed, payment is due to me on the day, cash or card.\n\nYour request:\n\n{$summary}\n\nIf anything is wrong, just reply to this email or call/WhatsApp +385 97 753 9328.\n\nBernard\nTAXI Bernard, Vodice",
    $custHeaders
);

echo json_encode(['success' => true, 'id' => $id]);
