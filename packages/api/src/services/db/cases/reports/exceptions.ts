import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type { ExceptionReportQuery } from "@moj-bichard7/common/types/Reports"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const exceptionsReport = async (
  database: DatabaseConnection,
  filters: ExceptionReportQuery,
  processChunk: (rows: Partial<CaseRow>[]) => Promise<void>
): Promise<void> => {
  const query = database.connection<Partial<CaseRow>[]>`
    SELECT
      el.asn,
      el.ptiurn,
      el.defendant_name,
      el.court_name,
      el.court_room,
      el.msg_received_ts,
      el.resolution_ts,
      el.annotated_msg,

      COALESCE(notes_agg.notes, '[]'::json) AS notes
    FROM
      br7own.error_list el
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
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
    await query.cursor(100, async (rows) => {
      await processChunk(rows)
    })
  } catch (err) {
    throw new Error(`Error fetching report: ${(err as Error).message}`)
  }
}
