import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"

export default async (caseId: number, exceptionCode: string, errorReport?: string): Promise<boolean> => {
  const dataSource = await getDataSource()

  await dataSource
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      errorCount: () => "error_count + 1",
      errorReason: exceptionCode,
      ...(errorReport && {
        errorReport: () =>
          `(CASE WHEN (error_report = '') THEN '${errorReport}' ELSE error_report || ', ' || '${errorReport}' END)`
      })
    })
    .where("errorId = :id", { id: caseId })
    .execute()

  return true
}
