-- Re-insert users
INSERT INTO br7own.users (username,exclusion_list,inclusion_list,endorsed_by,org_serves,forenames,surname,email,password,last_login_attempt,email_verification_code,email_verification_generated,deleted_at,password_reset_code,migrated_password,jwt_id,jwt_generated_at,visible_courts,visible_forces,excluded_triggers) VALUES ('heather.roberts','','B01,B41ME00','Endorser Not found','048C600','Heather','Roberts','heather.roberts@madetech.com','$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw','2020-01-01 00:00:00','','2020-01-01 00:00:00',NULL,'','{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux','',NULL,'B01,B41ME00','001,002,004,014,045',''); 

INSERT INTO br7own.users (username,exclusion_list,inclusion_list,endorsed_by,org_serves,forenames,surname,email,password,last_login_attempt,email_verification_code,email_verification_generated,deleted_at,password_reset_code,migrated_password,jwt_id,jwt_generated_at,visible_courts,visible_forces,excluded_triggers) VALUES ('tolu.johnson','','B01,B41ME00','Endorser Not found','048C600','Tolu','Johnson','tolu.johnson@madetech.com','$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw','2020-01-01 00:00:00','','2020-01-01 00:00:00',NULL,'','{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux','',NULL,'B01,B41ME00','001,002,004,014,045',''); 

INSERT INTO br7own.users_groups (SELECT id as user_id, (SELECT id from br7own.groups WHERE name =
  'B7Allocator_grp'
) as group_id FROM br7own.users WHERE username IN (
  'tolu.johnson', 'heather.roberts'
));

INSERT INTO br7own.users_groups (SELECT id as user_id, (SELECT id from br7own.groups WHERE name =
  'B7Audit_grp'
) as group_id FROM br7own.users WHERE username IN (
  'tolu.johnson', 'heather.roberts'
));

INSERT INTO br7own.users_groups (SELECT id as user_id, (SELECT id from br7own.groups WHERE name =
  'B7ExceptionHandler_grp'
) as group_id FROM br7own.users WHERE username IN (
  'tolu.johnson', 'heather.roberts'
));

INSERT INTO br7own.users_groups (SELECT id as user_id, (SELECT id from br7own.groups WHERE name =
  'B7Supervisor_grp'
) as group_id FROM br7own.users WHERE username IN (
  'tolu.johnson', 'heather.roberts'
));

INSERT INTO br7own.users_groups (SELECT id as user_id, (SELECT id from br7own.groups WHERE name =
  'B7TriggerHandler_grp'
) as group_id FROM br7own.users WHERE username IN (
  'tolu.johnson', 'heather.roberts'
));

INSERT INTO br7own.users_groups (SELECT id as user_id, (SELECT id from br7own.groups WHERE name =
  'B7UserManager_grp'
) as group_id FROM br7own.users WHERE username IN (
  'tolu.johnson', 'heather.roberts'
));

INSERT INTO br7own.users_groups (SELECT id as user_id, (SELECT id from br7own.groups WHERE name =
  'B7AuditLoggingManager_grp'
) as group_id FROM br7own.users WHERE username IN (
  'tolu.johnson', 'heather.roberts'
));

INSERT INTO br7own.users_groups (SELECT id as user_id, (SELECT id from br7own.groups WHERE name =
  'B7SuperUserManager_grp'
) as group_id FROM br7own.users WHERE username IN (
  'tolu.johnson', 'heather.roberts'
));

