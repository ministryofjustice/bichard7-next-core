import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { ResolutionStatus, resolutionStatusCodeByText } from "../../../useCases/dto/convertResolutionStatus"
import { organisationUnitSql } from "../organisationUnitSql"

export default async (database: WritableDatabaseConnection, user: User, caseId: number): PromiseResult<boolean> => {
  const status = resolutionStatusCodeByText(ResolutionStatus.Unresolved) as number

  const result = await database.connection`
    UPDATE br7own.error_list el
      SET
        error_locked_by_id = ${user.username}
      WHERE
        error_locked_by_id IS NULL AND
        error_count > 0 AND
        error_status = ${status} AND
        error_id = ${caseId} AND
        (${organisationUnitSql(database, user)})
    `.catch((error: Error) => error)

  if (isError(result)) {
    return Error(`Couldn't lock exceptions for case id ${caseId} and user ${user.username}: ${result.message}`)
  }

  return result.count > 0
}
