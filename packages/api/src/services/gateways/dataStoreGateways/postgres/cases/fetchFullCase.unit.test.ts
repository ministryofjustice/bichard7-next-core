import type { Case } from "@moj-bichard7/common/types/Case"
import type postgres from "postgres"

import filter from "./fetchFullCase"

describe("fetchFullCase", () => {
  it("throws an error if the case isn't found", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql

    await expect(filter(sql, 0, [])).rejects.toThrow("Case not found")
  })

  it("throws an error if the case isn't in the correct force", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql

    await expect(filter(sql, 0, [2])).rejects.toThrow("Case not found")
  })

  it("fetches the Case", async () => {
    const expectedCase = {
      annotated_msg: "",
      court_reference: "",
      create_ts: new Date("2022-06-30T08:44:03.930Z"),
      error_count: 1,
      error_id: 0,
      error_locked_by_id: null,
      error_report: "",
      error_status: 1,
      is_urgent: 0,
      message_id: "",
      msg_received_ts: new Date("2022-06-30T08:44:03.930Z"),
      org_for_police_filter: "",
      phase: 1,
      resolution_ts: null,
      total_pnc_failure_resubmissions: 0,
      trigger_count: 0,
      user_updated_flag: 0
    } satisfies Case
    const sql = jest.fn(() => [expectedCase]) as unknown as postgres.Sql

    const returnedCase = await filter(sql, 0, [1])

    expect(returnedCase).toEqual(expectedCase)
  })
})
