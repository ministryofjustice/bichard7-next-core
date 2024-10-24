import type { Case } from "@moj-bichard7/common/types/Case"
import type End2EndPostgresGateway from "../testGateways/e2ePostgresGateway"

export const createCase = async (gateway: End2EndPostgresGateway, overrides: object = {}): Promise<Case> => {
  const dbCase = await gateway.createTestCase({
    annotated_msg: "AHO",
    court_reference: "ABC",
    create_ts: new Date().toDateString(),
    error_count: 0,
    error_report: "",
    is_urgent: 1,
    message_id: "ABC-DEF",
    msg_received_ts: new Date().toDateString(),
    org_for_police_filter: "01",
    phase: 1,
    total_pnc_failure_resubmissions: 0,
    trigger_count: 0,
    user_updated_flag: 1,
    error_locked_by_id: null,
    resolution_ts: null,
    error_status: null,
    ...overrides
  })

  return dbCase
}
