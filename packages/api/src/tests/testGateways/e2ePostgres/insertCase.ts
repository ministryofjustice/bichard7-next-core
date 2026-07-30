import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type postgres from "postgres"

export default async function (sql: postgres.Sql, caseRow: CaseRow): Promise<CaseRow> {
  if (
    !(
      caseRow.annotated_msg ||
      caseRow.court_reference ||
      caseRow.create_ts ||
      caseRow.error_count ||
      caseRow.error_report ||
      caseRow.is_urgent ||
      caseRow.message_id ||
      caseRow.msg_received_ts ||
      caseRow.org_for_police_filter ||
      caseRow.phase ||
      caseRow.total_pnc_failure_resubmissions ||
      caseRow.trigger_count ||
      caseRow.user_updated_flag
    )
  ) {
    throw new Error("Missing required attributes")
  }

  const caseToInsert: Record<string, unknown> = { ...caseRow }
  delete caseToInsert.defendant_name_upper
  delete caseToInsert.court_name_upper
  delete caseToInsert.notes
  delete caseToInsert.triggers

  const caseColumns = Object.keys(caseToInsert).sort()

  const result = await sql<CaseRow[]>`
    INSERT INTO br7own.error_list
      ${sql(caseToInsert as never, caseColumns)}
    RETURNING *;
  `

  if (!result) {
    throw new Error("Could not insert Case into the DB")
  }

  return result[0]
}
