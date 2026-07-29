-- Run this only if the bookings table already exists from an earlier
-- schema.sql import (before the advance-payment system was added). A fresh
-- install can just use the current schema.sql instead.

ALTER TABLE bookings
  MODIFY COLUMN customer_email VARCHAR(160) NULL,
  ADD COLUMN contact_method   VARCHAR(10) NULL AFTER notes,
  ADD COLUMN payment_option   VARCHAR(10) NULL AFTER contact_method,
  ADD COLUMN invoice_required TINYINT(1) NOT NULL DEFAULT 0 AFTER payment_option;
