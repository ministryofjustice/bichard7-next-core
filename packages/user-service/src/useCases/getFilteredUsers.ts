import config from "lib/config"
import type Database from "types/Database"
import type PaginatedResult from "types/PaginatedResult"
import type PromiseResult from "types/PromiseResult"
import type User from "types/User"

const getFilteredUsers = async (
  connection: Database,
  filter: string,
  visibleForces: string,
  isSuperUser = false,
  page = 0
): PromiseResult<PaginatedResult<Partial<User>[]>> => {
  let users = []
  if (visibleForces !== "" || isSuperUser) {
    const forces = visibleForces.split(",")

    const forceWhere = forces.map((code) => String.raw`visible_forces ~ '\y${code}\y'`).join(" OR ")
    const getFilteredUsersQuery = `
      SELECT
        id,
        username,
        forenames,
        surname,
        email,
        COUNT(*) OVER() as all_users
      FROM br7own.users
      WHERE deleted_at IS NULL
        AND (LOWER(username) LIKE LOWER($1) OR
        LOWER(email) LIKE LOWER($1) OR
        LOWER(forenames) LIKE LOWER($1) OR
        LOWER(surname) LIKE LOWER($1) )
        AND (( ${forceWhere} ) OR ( ${isSuperUser} ) )
      ORDER BY username
        OFFSET ${page * config.maxUsersPerPage} ROWS
        FETCH NEXT ${config.maxUsersPerPage} ROWS ONLY
    `
    try {
      users = await connection.any(getFilteredUsersQuery, [`%${filter}%`])
    } catch (error) {
      return error as Error
    }
  }

  return {
    result: users.map((r: { [key: string]: string }) => ({
      id: Number(r.id),
      username: r.username,
      forenames: r.forenames,
      surname: r.surname,
      emailAddress: r.email
    })),
    totalElements: users.length === 0 ? 0 : users[0].all_users
  }
}

export default getFilteredUsers
