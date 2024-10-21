import type { User } from "@moj-bichard7/common/types/User"
import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type postgres from "postgres"

export default async (sql: postgres.Sql, user: User, groups: UserGroup[]): Promise<void> => {
  await sql`
    INSERT INTO br7own.users_groups (
      SELECT
        (
          SELECT
            id AS user_id
          FROM
            br7own.users
          WHERE
            username = ${user.username}) AS user_id,
          id AS group_id
        FROM
          br7own.groups
        WHERE
          friendly_name = ANY(${groups})
    );
  `
}
