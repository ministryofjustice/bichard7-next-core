import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export default async function incrementPncFailureResubmission(
  databaseConnection: WritableDatabaseConnection,
  caseId: number
): PromiseResult<boolean> {
  const result = await databaseConnection.connection`
    UPDATE br7own.error_list
    SET total_pnc_failure_resubmissions = total_pnc_failure_resubmissions + 1
    WHERE error_id = ${caseId}
  `.catch((error: Error) => error)

  if (isError(result)) {
    return result
  }

  return result.count > 0
}
