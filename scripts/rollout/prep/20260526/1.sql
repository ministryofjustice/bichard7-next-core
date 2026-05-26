-- set onlyAccessToNewBichard flag to true
BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'true', true)
WHERE
  deleted_at ISNULL AND
  id IN (595, 94, 10298, 1551, 598, 6941, 604, 200, 6934, 6940, 1547, 1549, 653, 1548, 233, 189, 1537, 638, 6936, 258, 6937, 226, 6939, 357, 6931, 1550, 6932, 1502, 224, 546, 6938, 6933, 492, 6935, 10299, 457, 10297, 9439, 375, 515)
RETURNING id, username, email;
COMMIT;


-- rollback
BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'false', true)
WHERE
  deleted_at ISNULL AND
  id IN (595, 94, 10298, 1551, 598, 6941, 604, 200, 6934, 6940, 1547, 1549, 653, 1548, 233, 189, 1537, 638, 6936, 258, 6937, 226, 6939, 357, 6931, 1550, 6932, 1502, 224, 546, 6938, 6933, 492, 6935, 10299, 457, 10297, 9439, 375, 515)
RETURNING id, username, email;
COMMIT;



