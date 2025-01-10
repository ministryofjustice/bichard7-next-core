import type { RawCaseFullData } from "@moj-bichard7/common/types/Case"
import type postgres from "postgres"

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

  const caseToInsert = partialCase as unknown as RawCaseFullData

  const [result]: [RawCaseFullData?] = await sql`
    INSERT INTO br7own.error_list
      (annotated_msg, court_reference, create_ts, error_count, error_report, is_urgent, message_id, msg_received_ts,
        org_for_police_filter, phase, total_pnc_failure_resubmissions, trigger_count, user_updated_flag,
        error_locked_by_id, resolution_ts, error_status, trigger_locked_by_id)
    VALUES
      (
        ${caseToInsert.annotated_msg},
        ${caseToInsert.court_reference},
        ${caseToInsert.create_ts},
        ${caseToInsert.error_count},
        ${caseToInsert.error_report},
        ${caseToInsert.is_urgent},
        ${caseToInsert.message_id},
        ${caseToInsert.msg_received_ts},
        ${caseToInsert.org_for_police_filter},
        ${caseToInsert.phase},
        ${caseToInsert.total_pnc_failure_resubmissions},
        ${caseToInsert.trigger_count},
        ${caseToInsert.user_updated_flag},
        ${caseToInsert.error_locked_by_id},
        ${caseToInsert.resolution_ts},
        ${caseToInsert.error_status},
        ${caseToInsert.trigger_locked_by_id}
      )
    RETURNING *;
  `

  if (!result) {
    throw new Error("Could not insert Case into the DB")
  }

  return result
}
