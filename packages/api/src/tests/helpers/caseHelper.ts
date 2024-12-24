import type { CaseDB } from "@moj-bichard7/common/types/Case"

import type End2EndPostgres from "../testGateways/e2ePostgres"

export const createCase = async (db: End2EndPostgres, overrides: object = {}): Promise<CaseDB> => {
  const dbCase = await db.createTestCase({
    annotated_msg: "AHO",
    court_reference: "ABC",
    create_ts: new Date().toDateString(),
    error_count: 0,
    error_locked_by_id: null,
    error_report: "",
    error_status: null,
    is_urgent: 1,
    message_id: "ABC-DEF",
    msg_received_ts: new Date().toDateString(),
    org_for_police_filter: "01",
    phase: 1,
    resolution_ts: null,
    total_pnc_failure_resubmissions: 0,
    trigger_count: 0,
    user_updated_flag: 1,
    ...overrides
  })

  return dbCase
}
