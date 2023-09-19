-- Update the default feature flag format for MT and example users

UPDATE br7own.users SET feature_flags = '"{\"test_flag\":true}"' WHERE email LIKE '%@madetech.com' OR email LIKE '%@example.com';
