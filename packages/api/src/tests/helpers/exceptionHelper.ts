import type End2EndPostgres from "../testGateways/e2ePostgres"

import { ResolutionStatus, resolutionStatusCodeByText } from "../../useCases/dto/convertResolutionStatus"

export const createExceptionOnCase = async (
  postgres: End2EndPostgres,
  caseId: number,
  exceptionCode: string,
  errorReport?: string,
  errorStatus?: ResolutionStatus,
  username?: string
) => {
  const isExceptionResolved = errorStatus === ResolutionStatus.Resolved
  const errorStatusNum = errorStatus ? (resolutionStatusCodeByText(errorStatus) ?? 1) : 1

  let errorResolvedBy: null | string = null
  let errorResolvedTimestamp: Date | null = null

  if (isExceptionResolved) {
    errorResolvedBy = username ?? "BichardForce03"
    errorResolvedTimestamp = new Date()
  }

  postgres.updateCaseWithException(
    caseId,
    exceptionCode,
    errorResolvedBy,
    errorResolvedTimestamp,
    errorStatusNum,
    errorReport
  )
}
