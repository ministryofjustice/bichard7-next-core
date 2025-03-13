import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

export default async (sql: postgres.Sql, partialUser: Partial<User>) => {
  if (!(partialUser.email && partialUser.username)) {
    throw new Error("Missing required attributes")
  }

  const userColumns = Object.keys(partialUser).sort()

  const [result]: [User?] = await sql`
    INSERT INTO br7own.users
      ${sql(
        partialUser as never,
        userColumns.filter((uc) => uc !== "groups")
      )}
    RETURNING *
  `

  if (!result) {
    throw new Error("Could not insert User into the DB")
  }

  return result
}
