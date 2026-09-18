BEGIN;
UPDATE
  br7own.users
SET
    feature_flags = COALESCE(feature_flags, '{}'::jsonb) || '{
        "allocationEnabled": true,
        "useTriggerAndExceptionQualityAuditingEnabled": true
    }'::jsonb
WHERE
  deleted_at ISNULL AND
  id IN (12939,10236,5908,1566,1518,1249,1215,1089,1075,995,978,975,959,952,948,939,861,858,813,774,767,681,623,607,585,475,456,424,422,412,404,384,360,215)
RETURNING id, username, email;
COMMIT;