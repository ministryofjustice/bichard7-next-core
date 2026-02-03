import type { CaseForReport, CaseRowForReport } from "@moj-bichard7/common/types/Case"
import type { ExceptionReportQuery, ExceptionReportType } from "@moj-bichard7/common/types/Reports"
import type { User } from "@moj-bichard7/common/types/User"
import type { PendingQuery, Row } from "postgres"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

import { processExceptions } from "../../../../useCases/cases/reports/processExceptions"
import { organisationUnitSql } from "../../organisationUnitSql"

export const exceptionsReport = async (
  database: DatabaseConnection,
  user: User,
  filters: ExceptionReportQuery,
  processChunk: (rows: CaseForReport[]) => Promise<void>
): Promise<void> => {
  const createQueryPart = (type: ExceptionReportType) => {
    const isException = type === "Exceptions"
    const resolvedByCol = isException ? "error_resolved_by" : "trigger_resolved_by"
    const resolvedTsCol = isException ? "error_resolved_ts" : "trigger_resolved_ts"
    const statusCol = isException ? "error_status" : "trigger_status"

    return database.connection`
      SELECT
        ${isException ? "Exception" : "Trigger"}::text as type,
        el.${database.connection(resolvedByCol)} as resolver,
        el.error_id,
        el.asn,
        el.ptiurn,
        el.defendant_name,
        el.court_name,
        el.court_room,
        el.court_date,
        el.court_reference,
        el.msg_received_ts,
        el.${database.connection(resolvedTsCol)} as resolved_ts,
        COALESCE(notes_agg.notes, '[]'::json) AS notes
      FROM
        br7own.error_list el
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'error_id', n.error_id,
            'note_id', n.note_id,
            'note_text', n.note_text,
            'user_id', n.user_id,
            'create_ts', n.create_ts
          )
          ORDER BY n.create_ts DESC
        ) AS notes
        FROM br7own.error_list_notes n
        WHERE n.error_id = el.error_id
      ) AS notes_agg ON true
      WHERE
        el.${database.connection(resolvedTsCol)} BETWEEN ${filters.fromDate} AND ${filters.toDate}
        AND el.${database.connection(statusCol)} = ${ResolutionStatusNumber.Resolved}
        AND (${organisationUnitSql(database, user)})
    `
  }

  const parts = []

  if (filters.exceptions) {
    parts.push(createQueryPart("Exceptions"))
  }

  if (filters.triggers) {
    parts.push(createQueryPart("Triggers"))
  }

  if (parts.length === 0) {
    return
  }

  let combinedParts: PendingQuery<Row[]>

  if (parts.length === 1) {
    combinedParts = parts[0]
  } else {
    combinedParts = database.connection`${parts[0]} UNION ALL ${parts[1]}`
  }

  const fullQuery = database.connection<CaseRowForReport[]>`
    WITH combined_data AS (${combinedParts})
    SELECT * FROM combined_data cb
    ORDER BY resolver, type DESC, resolved_ts, error_id
  `

  try {
    await fullQuery.cursor(100, async (rows) => {
      await processChunk(rows.map(processExceptions))
    })
  } catch (err) {
    throw new Error(`Error fetching report: ${(err as Error).message}`)
  }
}
