import type { UserRow } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import { isError } from "@moj-bichard7/common/types/Result"

export default async (sql: postgres.Sql, userRow: UserRow): Promise<UserRow> => {
  if (!(userRow.email && userRow.username)) {
    throw new Error("Missing required attributes")
  }

  const userColumns = Object.keys(userRow).sort()

  const result = await sql<UserRow[]>`
    INSERT INTO br7own.users
      ${sql(
        userRow as never,
        userColumns.filter((uc) => uc !== "groups")
      )}
    RETURNING *
  `.catch((error: Error) => error)

  if (!result || isError(result)) {
    throw new Error(`Could not insert User into the DB: ${result.message}`)
  }

  return result[0]
}
