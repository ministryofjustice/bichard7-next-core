import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { resolutionStatusCodeByText } from "../../../useCases/dto/convertResolutionStatus"
import { organisationUnitSql } from "../organisationUnitSql"

export default async (database: DatabaseConnection, user: User, caseId: number): PromiseResult<boolean> => {
  const status: number = resolutionStatusCodeByText(ResolutionStatus.Unresolved) as number

  const result = await database.connection`
    UPDATE br7own.error_list el
      SET
        trigger_locked_by_id = ${user.username}
      WHERE
        trigger_locked_by_id IS NULL AND
        trigger_count > 0 AND
        trigger_status = ${status} AND
        error_id = ${caseId} AND
        (${organisationUnitSql(database, user)})
  `.catch((error: Error) => error)

  if (isError(result)) {
    return Error(`Error while locking trigger for case id ${caseId} and user ${user.username}: ${result.message}`)
  }

  return result.count > 0
}
