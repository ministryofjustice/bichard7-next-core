-- Clean up un-needed users
DELETE FROM br7own.users_groups WHERE user_id = (SELECT id FROM br7own.users WHERE username = 'simon.oldham');
DELETE FROM br7own.users_groups WHERE user_id = (SELECT id FROM br7own.users WHERE username = 'jazz.sarkaria');
DELETE FROM br7own.users_groups WHERE user_id = (SELECT id FROM br7own.users WHERE username = 'tom.vaughan');
DELETE FROM br7own.users_groups WHERE user_id = (SELECT id FROM br7own.users WHERE username = 'heather.roberts');
DELETE FROM br7own.users_groups WHERE user_id = (SELECT id FROM br7own.users WHERE username = 'tolu.johnson');

DELETE FROM br7own.users WHERE username = 'simon.oldham';
DELETE FROM br7own.users WHERE username = 'jazz.sarkaria';
DELETE FROM br7own.users WHERE username = 'tom.vaughan';
DELETE FROM br7own.users WHERE username = 'heather.roberts';
DELETE FROM br7own.users WHERE username = 'tolu.johnson';
