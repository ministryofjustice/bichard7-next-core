import { isError } from "@moj-bichard7/common/types/Result"
import { DataSource } from "typeorm"

type UsersQueryResult = { username: string }[]

export async function findUsersWithAccessToNewUi(postgres: DataSource): Promise<string[] | Error> {
  const result = await postgres
    .query<UsersQueryResult>(
      `
        SELECT u.username FROM br7own.users AS u
        INNER JOIN br7own.users_groups AS ug ON u.id = ug.user_id
        INNER JOIN br7own.groups AS g ON g.id = ug.group_id
        WHERE u.email NOT ILIKE '%madetech%' AND u.deleted_at IS NULL
      `
    )
    .catch((error) => error as Error)

  if (isError(result)) {
    return result
  }

  return result.map(({ username }) => username)
}
