import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
import type { ExceptionReportDto, ExceptionReportType } from "@moj-bichard7/common/types/reports/Exceptions"
import type { User } from "@moj-bichard7/common/types/User"
import type { PendingQuery, Row } from "postgres"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { endOfDay, startOfDay } from "date-fns"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"
import type { UserExceptionReportRow } from "../../../../types/reports/Exceptions"

import { processUsers } from "../../../../useCases/cases/reports/exceptions/processUsers"
import { organisationUnitSql } from "../../organisationUnitSql"

export async function* exceptionsReport(
  database: DatabaseConnection,
  user: User,
  filters: ExceptionReportQuery
): AsyncGenerator<ExceptionReportDto[]> {
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
          ORDER BY n.create_ts ASC
        ) AS notes
        FROM br7own.error_list_notes n
        WHERE n.error_id = el.error_id
      ) AS notes_agg ON true
      WHERE
        el.${database.connection(resolvedTsCol)} BETWEEN ${startOfDay(filters.fromDate)} AND ${endOfDay(filters.toDate)}
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

  const fullQuery = database.connection<UserExceptionReportRow[]>`
    WITH combined_data AS (${combinedParts})
    SELECT
      cb.resolver as username,
      json_agg(cb.* ORDER BY cb.type DESC, cb.resolved_ts, cb.error_id) as cases
    FROM combined_data cb
    GROUP BY cb.resolver
    ORDER BY cb.resolver
  `

  try {
    const cursor = fullQuery.cursor(25)
    for await (const userRows of cursor) {
      yield processUsers(userRows)
    }
  } catch (err) {
    throw new Error(`Error fetching report: ${(err as Error).message}`)
  }
}
