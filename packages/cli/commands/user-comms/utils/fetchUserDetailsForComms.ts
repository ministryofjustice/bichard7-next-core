import type { DataSource } from "typeorm"
import { isError } from "@moj-bichard7/common/types/Result"

type UsersQueryResult = { forenames: string; email: string }[]

export async function fetchUserDetailsForComms(postgres: DataSource): Promise<string[][] | Error> {
  const result = await postgres
    .query<UsersQueryResult>(
      `
        SELECT u.forenames, u.email 
        FROM br7own.users AS u
        WHERE u.deleted_at IS NULL
        ORDER BY u.forenames
      `
    )
    .catch((error) => error as Error)

  if (isError(result)) {
    return result
  }

  return result.map(({ forenames, email }) => [forenames, email])
}
