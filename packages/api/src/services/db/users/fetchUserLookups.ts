import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { type User } from "@moj-bichard7/common/types/User"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { userLookupRowSchema } from "../mapUserRowToUser"
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
    const nameWhere = sql`
    u.username ILIKE ${fuzzyName} 
    OR (u.forenames || ' ' || u.surname) ILIKE ${fuzzyName}
    OR (u.surname || ' ' || u.forenames) ILIKE ${fuzzyName}
  `
    where = sql`${where} AND (${nameWhere})`
  }

  const userResult = await database.connection`
      SELECT
        u.id,
        u.username,
        u.forenames,
        u.surname,
        u.deleted_at
      FROM
        br7own.users u
      WHERE
          ${where} AND u.deleted_at IS NULL`

  if (!userResult || userResult.length === 0) {
    return { users: [] }
  }

  const users: User[] = []
  for (const row of userResult) {
    const parsed = userLookupRowSchema.safeParse(row)
    if (!parsed.success) {
      return new Error(parsed.error.message)
    }

    users.push({
      deletedAt: parsed.data.deleted_at,
      forenames: parsed.data.forenames,
      id: parsed.data.id,
      surname: parsed.data.surname,
      username: parsed.data.username
    } as unknown as User)
  }

  return { users }
}
