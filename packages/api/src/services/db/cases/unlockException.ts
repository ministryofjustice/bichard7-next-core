import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { organisationUnitSql } from "../organisationUnitSql"

export default async function unlockException(
  database: WritableDatabaseConnection,
  user: User,
  caseId: number
): PromiseResult<boolean> {
  const result = await database.connection`
    UPDATE br7own.error_list el
      SET
        error_locked_by_id = NULL
      WHERE
        error_id = ${caseId} AND
      (${organisationUnitSql(database, user)})
    `.catch((error: Error) => error)

  if (isError(result)) {
    return new Error(`Couldn't unlock exceptions for case id ${caseId}: ${result.message}`)
  }

  return result.count > 0
}
