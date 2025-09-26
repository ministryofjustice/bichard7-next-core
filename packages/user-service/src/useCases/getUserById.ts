import Database from "types/Database"
import User from "types/User"
import { isError } from "types/Result"
import PromiseResult from "types/PromiseResult"
import getUserSpecificGroups from "./getUserSpecificGroups"

const getUserById = async (connection: Database, id: number): PromiseResult<Partial<User>> => {
  let user

  const getUserByIdQuery = `
      SELECT
        id,
        username ,
        forenames,
        surname,
        endorsed_by,
        org_serves,
        email,
        visible_courts,
        visible_forces,
        excluded_triggers
      FROM br7own.users AS u
      WHERE id = $\{id\} AND deleted_at IS NULL
    `

  try {
    user = await connection.one(getUserByIdQuery, { id })
  } catch (error) {
    return error as Error
  }

  const groups = await getUserSpecificGroups(connection, user.username)
  if (isError(groups)) {
    return groups
  }

  return {
    id: user.id,
    username: user.username,
    forenames: user.forenames,
    surname: user.surname,
    endorsedBy: user.endorsed_by,
    orgServes: user.org_serves,
    emailAddress: user.email,
    groups,
    visibleCourts: user.visible_courts,
    visibleForces: user.visible_forces,
    excludedTriggers: user.excluded_triggers
  }
}

export default getUserById
