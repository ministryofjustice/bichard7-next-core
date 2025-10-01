import getTestConnection from "../getTestConnection"

const insertGroupHierarchies = async () => {
  const connection = getTestConnection()
  const queries = []

  queries.push(
    connection.none(`
  UPDATE br7own.groups
  SET parent_id = (
      SELECT id
      FROM br7own.groups
      WHERE name = 'B7SuperUserManager_grp'
  )
  WHERE name = 'B7AuditLoggingManager_grp'`),
    {}
  )

  queries.push(
    connection.none(`
  UPDATE br7own.groups
  SET parent_id = (
      SELECT id
      FROM br7own.groups
      WHERE name = 'B7SuperUserManager_grp'
  )
  WHERE name = 'B7UserManager_grp'`),
    {}
  )

  queries.push(
    connection.none(`
  UPDATE br7own.groups
  SET parent_id = (
      SELECT id
      FROM br7own.groups
      WHERE name = 'B7UserManager_grp'
  )
  WHERE name = 'B7Audit_grp'`),
    {}
  )

  queries.push(
    connection.none(`
  UPDATE br7own.groups
  SET parent_id = (
      SELECT id
      FROM br7own.groups
      WHERE name = 'B7UserManager_grp'
  )
  WHERE name = 'B7Supervisor_grp'`),
    {}
  )

  queries.push(
    connection.none(`
  UPDATE br7own.groups
  SET parent_id = (
      SELECT id
      FROM br7own.groups
      WHERE name = 'B7Supervisor_grp'
  )
  WHERE name = 'B7Allocator_grp'`),
    {}
  )

  queries.push(
    connection.none(`
  UPDATE br7own.groups
  SET parent_id = (
      SELECT id
      FROM br7own.groups
      WHERE name = 'B7Supervisor_grp'
  )
  WHERE name = 'B7GeneralHandler_grp'`),
    {}
  )

  queries.push(
    connection.none(`
  UPDATE br7own.groups
  SET parent_id = (
      SELECT id
      FROM br7own.groups
      WHERE name = 'B7GeneralHandler_grp'
  )
  WHERE name = 'B7TriggerHandler_grp'`),
    {}
  )

  queries.push(
    connection.none(`
  UPDATE br7own.groups
  SET parent_id = (
      SELECT id
      FROM br7own.groups
      WHERE name = 'B7GeneralHandler_grp'
  )
  WHERE name = 'B7ExceptionHandler_grp'`),
    {}
  )

  return Promise.all(queries)
}

export default insertGroupHierarchies
