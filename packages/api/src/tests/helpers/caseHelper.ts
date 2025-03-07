import type { Case } from "@moj-bichard7/common/types/Case"

import { randomUUID } from "crypto"

import type End2EndPostgres from "../testGateways/e2ePostgres"

import { testAhoXml } from "./ahoHelper"

export const createCase = async (postgres: End2EndPostgres, overrides: object = {}): Promise<Case> => {
  return await postgres.createTestCase({
    annotated_msg: testAhoXml,
    court_reference: "ABC",
    create_ts: new Date(),
    error_count: 1,
    error_locked_by_id: null,
    error_report: "",
    error_status: 1,
    is_urgent: 1,
    message_id: "ABC-DEF",
    msg_received_ts: new Date(),
    org_for_police_filter: "01",
    phase: 1,
    resolution_ts: null,
    total_pnc_failure_resubmissions: 0,
    trigger_count: 1,
    trigger_locked_by_id: null,
    user_updated_flag: 1,
    ...overrides
  })
}

export const createCases = async (
  postgres: End2EndPostgres,
  numOfCasesToCreate: number,
  overrides: Record<number, object> = {}
): Promise<Case[]> => {
  return Promise.all(
    Array(numOfCasesToCreate)
      .fill(null)
      .map(async (_, index) => {
        overrides[index] = { error_id: index, message_id: randomUUID(), ...overrides[index] }

        return await createCase(postgres, overrides[index])
      })
  )
}
