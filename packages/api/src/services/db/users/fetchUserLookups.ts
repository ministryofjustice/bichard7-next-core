import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserRow } from "@moj-bichard7/common/types/User"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import mapUserRowToUser from "../mapUserRowToUser"
import filterUsersByVisibleForces from "./filterUsersByVisibleForces"

export type FetchUsersResult = {
  users: User[]
}

export default async (
  database: DatabaseConnection,
  user: User,
  usernameOrName?: string
): PromiseResult<FetchUsersResult> => {
  const sql = database.connection

  if (user.visibleForces.length === 0) {
    return { users: [] }
  }

  const visibleForcesFilter = filterUsersByVisibleForces(database, user.visibleForces)

  let where = sql`(${visibleForcesFilter})`

  if (usernameOrName && usernameOrName.trim() !== "") {
    const fuzzyName = `%${usernameOrName.trim()}%`
    const nameWhere = sql`u.username ILIKE ${fuzzyName} OR u.forenames ILIKE ${fuzzyName} OR u.surname ILIKE ${fuzzyName}`
    where = sql`${where} AND (${nameWhere})`
  }

  const userResult = await database.connection<UserRow[]>`
      SELECT
        u.id,
        u.forenames,
        u.surname
      FROM
        br7own.users u
      WHERE
          ${where}`

  const users = userResult.map((u) => mapUserRowToUser(u))

  return { users: users }
}
