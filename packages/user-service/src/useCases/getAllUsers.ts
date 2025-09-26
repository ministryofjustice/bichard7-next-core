import config from "lib/config"
import type Database from "types/Database"
import type PaginatedResult from "types/PaginatedResult"
import type PromiseResult from "types/PromiseResult"
import type User from "types/User"

const getAllUsers = async (
  connection: Database,
  visibleForces: string,
  isSuperUser = false,
  page = 0
): PromiseResult<PaginatedResult<Pick<User, "username" | "forenames" | "surname" | "emailAddress">[]>> => {
  let users = []
  if (visibleForces !== "" || isSuperUser) {
    const forces = visibleForces.split(",")

    const forceWhere = forces.map((code) => `visible_forces ~ '\\y${code}\\y'`).join(" OR ")
    const getAllUsersQuery = `
      SELECT
        username,
        forenames,
        surname,
        email,
        COUNT(*) OVER() as all_users
      FROM br7own.users
      WHERE deleted_at IS NULL
        AND (( ${forceWhere} ) OR ( ${isSuperUser} ) )
      ORDER BY username
        OFFSET ${page * config.maxUsersPerPage} ROWS
        FETCH NEXT ${config.maxUsersPerPage} ROWS ONLY
    `

    try {
      users = await connection.any(getAllUsersQuery, forces)
    } catch (error) {
      return error as Error
    }
  }

  return {
    result: users.map((r: { [key: string]: string }) => ({
      username: r.username,
      forenames: r.forenames,
      surname: r.surname,
      emailAddress: r.email
    })),
    totalElements: users.length === 0 ? 0 : users[0].all_users
  }
}

export default getAllUsers
