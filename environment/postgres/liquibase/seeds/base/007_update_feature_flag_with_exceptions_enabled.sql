-- Ensure MT and dummy user have exceptions enabled
UPDATE br7own.users SET feature_flags = '"{\"exceptionsEnabled\":true}"' WHERE email LIKE '%@madetech.com' OR email LIKE '%@example.com';
