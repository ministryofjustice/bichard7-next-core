import type { ResolutionStatus } from "types/ResolutionStatus"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"

export default async (
  caseId: number,
  exceptionCode: string,
  errorReport?: string,
  errorStatus?: ResolutionStatus,
  username?: string
): Promise<boolean> => {
  const dataSource = await getDataSource()
  const isExceptionResolved = errorStatus === "Resolved"
  await dataSource
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      errorCount: () => "error_count + 1",
      errorReason: exceptionCode,
      ...(errorReport && {
        errorReport: () =>
          `(CASE WHEN (error_report = '') THEN '${errorReport}' ELSE error_report || ', ' || '${errorReport}' END)`
      }),
      errorResolvedBy: isExceptionResolved ? (username ?? "BichardForce03") : null,
      errorResolvedTimestamp: isExceptionResolved ? new Date() : null,
      errorStatus: errorStatus ?? "Unresolved"
    })
    .where("errorId = :id", { id: caseId })
    .execute()

  return true
}
