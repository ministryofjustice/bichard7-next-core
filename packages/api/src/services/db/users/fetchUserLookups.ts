import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { type User, type UserLookupRow, UserLookupRowSchema } from "@moj-bichard7/common/types/User"
import z from "zod"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import filterUsersByVisibleForces from "./filterUsersByVisibleForces"

export type FetchUsersResult = {
  users: UserLookupRow[]
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
        u.forenames,
        u.surname
      FROM
        br7own.users u
      WHERE
          ${where} AND u.deleted_at IS NULL`

  if (!userResult || userResult.length === 0) {
    return { users: [] }
  }

  const parsedResults = z.array(UserLookupRowSchema).safeParse(userResult)
  if (!parsedResults.success) {
    return parsedResults.error
  }

  return { users: parsedResults.data }
}
