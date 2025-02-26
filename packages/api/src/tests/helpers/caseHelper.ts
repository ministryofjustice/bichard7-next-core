import type { Case } from "@moj-bichard7/common/types/Case"

import type End2EndPostgres from "../testGateways/e2ePostgres"

import { testAhoXml } from "./ahoHelper"

export const createCase = async (postgres: End2EndPostgres, overrides: object = {}): Promise<Case> => {
  const caseData = await postgres.createTestCase({
    annotated_msg: testAhoXml,
    court_reference: "ABC",
    create_ts: new Date(),
    error_count: 0,
    error_locked_by_id: null,
    error_report: "",
    error_status: null,
    is_urgent: 1,
    message_id: "ABC-DEF",
    msg_received_ts: new Date(),
    org_for_police_filter: "01",
    phase: 1,
    resolution_ts: null,
    total_pnc_failure_resubmissions: 0,
    trigger_count: 0,
    trigger_locked_by_id: null,
    user_updated_flag: 1,
    ...overrides
  })

  return caseData
}
