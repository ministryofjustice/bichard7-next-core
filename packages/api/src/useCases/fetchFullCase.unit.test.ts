import type { User } from "@moj-bichard7/common/types/User"

import FakeDataStore from "../services/gateways/dataStoreGateways/fakeDataStore"
import fetchFullCase from "./fetchFullCase"

describe("fetchFullCase", () => {
  const db = new FakeDataStore()

  it("returns a case", async () => {
    const user = { visible_forces: "001" } as User
    const result = await fetchFullCase(user, db, 0)

    expect(result).toEqual({
      aho: "",
      asn: "",
      updatedHearingOutcome: null
    })
  })

  it("returns error when no force associated to a user", async () => {
    const user = { visible_forces: "" } as User

    await expect(fetchFullCase(user, db, 0)).rejects.toThrow("No force associated to User")
  })
})
