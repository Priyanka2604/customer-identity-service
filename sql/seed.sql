-- File: sql/seed.sql
-- This file contains SQL commands to seed the database with initial data.
-- Ensure the contact table exists
-- and the sequence is reset before running this script.

INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence)
VALUES 
('9999999999', 'john@example.com', NULL, 'primary'),
('9999999999', NULL, 1, 'secondary'),
(NULL, 'john@example.com', 1, 'secondary');

-- Clear existing data
DELETE FROM contact;
ALTER SEQUENCE contact_id_seq RESTART WITH 1;

-- Basic primary contact
INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence)
VALUES ('9999999999', 'a@example.com', NULL, 'primary');

-- Secondary with same phone
INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence)
VALUES ('9999999999', NULL, 1, 'secondary');

-- Secondary with same email
INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence)
VALUES (NULL, 'a@example.com', 1, 'secondary');

-- Another "primary" that should be resolved/merged in logic
INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence)
VALUES ('1111111111', 'a@example.com', NULL, 'primary');

-- A totally new user
INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence)
VALUES ('8888888888', 'new@example.com', NULL, 'primary');

-- Primary with manual timestamp (e.g., for sorting test)
INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence, createdAt)
VALUES ('7777777777', 't@example.com', NULL, 'primary', '2023-01-01 10:00:00');

-- ⚠️ Edge case: no phone/email (you should block this in backend logic)
INSERT INTO contact (linkedId, linkPrecedence)
VALUES (1, 'secondary');

-- Avoid inserting a row with both phone and email as NULL
/*
ALTER TABLE contact ADD CONSTRAINT check_contact_not_null
CHECK (phoneNumber IS NOT NULL OR email IS NOT NULL);
*/
