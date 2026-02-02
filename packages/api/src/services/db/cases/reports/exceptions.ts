import type { CaseForReport, CaseRowForReport } from "@moj-bichard7/common/types/Case"
import type { ExceptionReportQuery } from "@moj-bichard7/common/types/Reports"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

import { processExceptions } from "../../../../useCases/cases/reports/processExceptions"

export const exceptionsReport = async (
  database: DatabaseConnection,
  filters: ExceptionReportQuery,
  processChunk: (rows: CaseForReport[]) => Promise<void>
): Promise<void> => {
  const query = database.connection<CaseRowForReport[]>`
    SELECT
      el.asn,
      el.ptiurn,
      el.defendant_name,
      el.court_date,
      el.court_name,
      el.court_room,
      el.court_reference,
      el.create_ts,
      el.annotated_msg,
      el.error_resolved_by,
      el.error_resolved_ts,
      el.trigger_resolved_by,
      el.trigger_resolved_ts,

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
      el.court_date BETWEEN ${filters.fromDate} AND ${filters.toDate}
      ${filters.exceptions ? database.connection`AND el.error_status = ${ResolutionStatusNumber.Resolved}` : database.connection``}
      ${filters.triggers ? database.connection`AND el.trigger_status = ${ResolutionStatusNumber.Resolved}` : database.connection``}
  `

  try {
    await query.cursor(100, async (rows: CaseRowForReport[]) => {
      await processChunk(rows.map(processExceptions))
    })
  } catch (err) {
    throw new Error(`Error fetching report: ${(err as Error).message}`)
  }
}
