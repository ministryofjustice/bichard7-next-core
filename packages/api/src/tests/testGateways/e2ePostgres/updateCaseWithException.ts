import type postgres from "postgres"

export default async function (
  sql: postgres.Sql,
  caseId: number,
  exceptionCode: string,
  errorResolvedBy: null | string,
  errorResolvedTimestamp: Date | null,
  errorStatus: number,
  errorReport?: string
) {
  let errorReportSql = sql``

  if (errorReport) {
    errorReportSql = sql`
      error_report =
        CASE WHEN (error_report = '') THEN ${errorReport}
        ELSE error_report || ', ' || ${errorReport}
      END
    `
  }

  await sql`
    UPDATE br7own.error_list
    SET
      error_count = error_count + 1,
      error_reason = ${exceptionCode},
      error_resolved_by = ${errorResolvedBy},
      error_resolved_ts = ${errorResolvedTimestamp},
      error_status = ${errorStatus},
      ${errorReportSql}
    WHERE error_id = ${caseId}
  `
}
