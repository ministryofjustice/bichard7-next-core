import type postgres from "postgres"

import { type RawCaseFullData } from "@moj-bichard7/common/types/Case"

export default async function (sql: postgres.Sql, partialCase: Partial<RawCaseFullData>): Promise<RawCaseFullData> {
  if (
    !(
      partialCase.annotated_msg ||
      partialCase.court_reference ||
      partialCase.create_ts ||
      partialCase.error_count ||
      partialCase.error_report ||
      partialCase.is_urgent ||
      partialCase.message_id ||
      partialCase.msg_received_ts ||
      partialCase.org_for_police_filter ||
      partialCase.phase ||
      partialCase.total_pnc_failure_resubmissions ||
      partialCase.trigger_count ||
      partialCase.user_updated_flag
    )
  ) {
    throw new Error("Missing required attributes")
  }

  const caseColumns = Object.keys(partialCase).sort()

  const [result]: [RawCaseFullData?] = await sql`
    INSERT INTO br7own.error_list
      ${sql(partialCase as never, caseColumns)}
    RETURNING *;
  `

  if (!result) {
    throw new Error("Could not insert Case into the DB")
  }

  return result
}
