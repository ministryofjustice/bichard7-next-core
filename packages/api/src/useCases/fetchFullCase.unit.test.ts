import type { User } from "@moj-bichard7/common/types/User"

import FakeDataStore from "../services/gateways/dataStoreGateways/fakeDataStore"
import fetchFullCase from "./fetchFullCase"

describe("fetchFullCase", () => {
  const db = new FakeDataStore()

  it("returns a case", async () => {
    const user = { visible_forces: "001" } as User
    const result = await fetchFullCase(user, db, 0)

    expect(result).toEqual({
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
    })
  })

  it("returns error when no force associated to a user", async () => {
    const user = { visible_forces: "" } as User

    await expect(fetchFullCase(user, db, 0)).rejects.toThrow("No force associated to User")
  })
})
