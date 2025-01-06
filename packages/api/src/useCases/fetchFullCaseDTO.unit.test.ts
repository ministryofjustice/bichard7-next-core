import type { CaseDTO } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import FakeDataStore from "../services/gateways/dataStoreGateways/fakeDataStore"
import fetchFullCaseDTO from "./fetchFullCaseDTO"

describe("fetchFullCaseDTO", () => {
  const db = new FakeDataStore()

  it("returns a case", async () => {
    const user = { visible_forces: "001" } as User
    const result = await fetchFullCaseDTO(user, db, 0)

    expect(result).toEqual({
      aho: "",
      asn: "",
      canUserEditExceptions: undefined,
      courtCode: "",
      courtDate: new Date("2022-06-30"),
      courtName: "",
      courtReference: "",
      defendantName: "",
      errorId: 0,
      errorLockedByUserFullName: undefined,
      errorLockedByUsername: null,
      errorReport: "",
      errorStatus: null,
      isUrgent: 0,
      orgForPoliceFilter: "",
      phase: 1,
      ptiurn: null,
      resolutionTimestamp: null,
      triggerCount: 0,
      triggerLockedByUserFullName: undefined,
      triggerLockedByUsername: null,
      triggerStatus: null,
      updatedHearingOutcome: ""
    } satisfies CaseDTO)
  })

  it("returns error when no force associated to a user", async () => {
    const user = { visible_forces: "" } as User

    await expect(fetchFullCaseDTO(user, db, 0)).rejects.toThrow("No force associated to User")
  })
})
