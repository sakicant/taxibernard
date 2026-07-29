<?php
/**
 * Canonical fixed prices, anchored at Vodice (Bernard's base). This is the
 * server's source of truth for what a route costs, used by booking-submit.php
 * to re-validate every submitted price before it's stored or emailed, since
 * the price a booking request arrives with is plain, editable URL/form text
 * that anyone can change by hand, never trust it on its own.
 *
 * Must be kept in sync with the PRICES.Vodice object in script.js, that's
 * the copy customers actually see in the quote widget and route pages.
 */
return [
    'Šibenik' => 30,
    'Split' => 155,
    'Zadar' => 100,
    'Murter' => 50,
    'Skradin' => 70,
    'Zagreb' => 490,
    'Dubrovnik' => 490,
    'Makarska' => 210,
    'Tisno' => 30,
    'Jezera' => 40,
    'Pirovac' => 30,
    'Betina' => 50,
    'Srima' => 15,
    'Tribunj' => 15,
    'Lozovac' => 60,
    'Primošten' => 70,
    'Čista Velika' => 40,
    'Gaćelezi' => 25,
    'Stankovci' => 45,
    'Split Airport (SPU)' => 115,
    'Zadar Airport (ZAD)' => 100,
    'Zagreb Airport (ZAG)' => 480,
    'Dubrovnik Airport (DBV)' => 480,
];
