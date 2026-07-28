<?php
/**
 * Copy this file to config.php on the server and fill in real values.
 * config.php is gitignored so credentials never end up in the repo.
 */

return [
    // MySQL / MariaDB connection (create the DB + user in cPanel first).
    'db_host' => 'localhost',
    'db_name' => 'YOUR_DB_NAME',
    'db_user' => 'YOUR_DB_USER',
    'db_pass' => 'YOUR_DB_PASSWORD',

    // Where booking notification emails are sent (Bernard).
    'admin_email' => 'bernard.mikulic@gmail.com',

    // "From" address for outgoing mail. Use an address on your own domain so
    // it is not flagged as spoofed.
    'mail_from' => 'noreply@taxivodice.hr',

    // Admin gate. The admin area is behind an HTTP Basic Auth prompt: nobody can
    // open any admin page without this username + password. The password is
    // stored as a salted SHA-256, never in plain text. Generate the salt and
    // hash once, then paste both below. To change the password later,
    // regenerate: sha256(salt . new-password).
    'admin_user'        => 'bernard',
    'admin_pass_salt'   => 'PASTE_SALT_HERE',
    'admin_pass_sha256' => 'PASTE_HASH_HERE',
];
