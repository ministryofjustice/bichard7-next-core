import type { Case } from "@moj-bichard7/common/types/Case"
import type postgres from "postgres"

import insertCase from "./insertCase"

describe("insertCase", () => {
  it("will throw an error if it's missing a needed attribute", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql
    const partialCase: Partial<Case> = {}

    await expect(insertCase(sql, partialCase)).rejects.toThrow("Missing required attributes")
  })

  it("will insert a case", async () => {
    const expectedCase = {
      annotated_msg: "AHO",
      court_reference: "ABC",
      create_ts: new Date(),
      error_count: 0,
      error_id: 1,
      error_locked_by_id: null,
      error_report: "",
      error_status: null,
      is_urgent: 1,
      message_id: "ABC-DEF",
      msg_received_ts: new Date(),
      org_for_police_filter: "001",
      phase: 1,
      resolution_ts: null,
      total_pnc_failure_resubmissions: 0,
      trigger_count: 0,
      user_updated_flag: 1
    } satisfies Partial<Case>
    const sql = jest.fn(() => [expectedCase]) as unknown as postgres.Sql
    const caseInserted: Partial<Case> = {
      annotated_msg: "AHO",
      court_reference: "ABC",
      create_ts: new Date(),
      error_count: 0,
      error_locked_by_id: null,
      error_report: "",
      error_status: null,
      is_urgent: 1,
      message_id: "ABC-DEF",
      msg_received_ts: new Date(),
      org_for_police_filter: "001",
      phase: 1,
      resolution_ts: null,
      total_pnc_failure_resubmissions: 0,
      trigger_count: 0,
      user_updated_flag: 1
    }

    const dbCase = await insertCase(sql, caseInserted)

    expect(expectedCase).toEqual(dbCase)
  })

  it("will throw an error if a Case doesn't get inserted", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql
    const partialCase: Partial<Case> = {
      annotated_msg: "AHO",
      court_reference: "ABC",
      create_ts: new Date(),
      error_count: 0,
      error_locked_by_id: null,
      error_report: "",
      error_status: null,
      is_urgent: 1,
      message_id: "ABC-DEF",
      msg_received_ts: new Date(),
      org_for_police_filter: "001",
      phase: 1,
      resolution_ts: null,
      total_pnc_failure_resubmissions: 0,
      trigger_count: 0,
      user_updated_flag: 1
    }

    await expect(insertCase(sql, partialCase)).rejects.toThrow("Could not insert Case into the DB")
  })
})
