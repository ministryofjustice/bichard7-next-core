import type postgres from "postgres"

import type { CaseDataForDto } from "../../../../../types/Case"

import filter from "./fetchCase"

describe("fetchCase", () => {
  it("throws an error if the case isn't found", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql

    await expect(filter(sql, 0, sql`TRUE`)).rejects.toThrow("Case not found")
  })

  it("throws an error if the case isn't in the correct force", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql

    await expect(filter(sql, 0, sql`TRUE`)).rejects.toThrow("Case not found")
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
      error_id: 0,
      error_locked_by_fullname: "",
      error_locked_by_id: null,
      error_report: "",
      error_status: 1,
      is_urgent: 0,
      notes: [],
      org_for_police_filter: "",
      phase: 1,
      ptiurn: "",
      resolution_ts: null,
      trigger_count: 0,
      trigger_locked_by_fullname: "",
      trigger_locked_by_id: null,
      trigger_status: 1,
      triggers: [],
      updated_msg: ""
    } satisfies CaseDataForDto
    const sql = jest.fn(() => [expectedCase]) as unknown as postgres.Sql

    const returnedCase = await filter(sql, 0, sql`TRUE`)

    expect(returnedCase).toEqual(expectedCase)
  })
})
