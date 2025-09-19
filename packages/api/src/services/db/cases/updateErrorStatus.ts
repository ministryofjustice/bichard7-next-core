import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"
import type { ResolutionStatus } from "../../../useCases/dto/convertResolutionStatus"

import { resolutionStatusCodeByText } from "../../../useCases/dto/convertResolutionStatus"

export default async function updateErrorStatus(
  databaseConnection: WritableDatabaseConnection,
  caseId: number,
  resolutionStatus: ResolutionStatus
): PromiseResult<boolean> {
  const resolutionStatusNum = resolutionStatusCodeByText(resolutionStatus)

  if (!resolutionStatusNum) {
    return new Error(`Resolution status ${resolutionStatus} not found`)
  }

  const result = await databaseConnection.connection`
    UPDATE br7own.error_list
    SET error_status = ${resolutionStatusNum}
    WHERE error_id = ${caseId}
    RETURNING *
  `.catch((error: Error) => error)

  if (isError(result)) {
    return result
  }

  const caseRow = result[0] as CaseRow

  return caseRow.error_status === resolutionStatusNum
}
