-- Ensure field has JSON object notation
UPDATE br7own.users SET feature_flags = '{"exceptionsEnabled": true}' WHERE email LIKE '%@madetech.com' OR email LIKE '%@example.com';
