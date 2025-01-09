import type { RawCaseData } from "@moj-bichard7/common/types/Case"
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

  // TODO: Replace the `as` with `satisfies`
  it("fetches the Case", async () => {
    const expectedCase = {
      annotated_msg: "",
      asn: "",
      court_code: "",
      court_date: null,
      court_name: "",
      court_reference: "",
      defendant_name: "",
      error_count: 1,
      error_id: 0,
      error_locked_by_fullname: "",
      error_locked_by_id: null,
      error_report: "",
      error_status: 1,
      is_urgent: 0,
      org_for_police_filter: "",
      phase: 1,
      ptiurn: "",
      resolution_ts: null,
      trigger_count: 0,
      trigger_locked_by_fullname: "",
      trigger_locked_by_id: null,
      trigger_status: 1,
      updated_msg: ""
    } as RawCaseData
    const sql = jest.fn(() => [expectedCase]) as unknown as postgres.Sql

    const returnedCase = await filter(sql, 0, [1])

    expect(returnedCase).toEqual(expectedCase)
  })
})
