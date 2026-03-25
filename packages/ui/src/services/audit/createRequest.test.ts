import type { FormState } from "../../types/audit/FormState"
import createRequest from "./createRequest"

describe("createRequest", () => {
  it("should create a new request", () => {
    const formState: FormState = {
      auditId: 123,
      fromDate: new Date(2026, 0, 10),
      toDate: new Date(2026, 0, 20),
      resolvedBy: ["user01", "user02"],
      includeExceptions: true,
      includeTriggers: true,
      triggers: ["TRPR0010"],
      volume: "20"
    }

    const request = createRequest(formState)

    expect(request).toEqual({
      fromDate: "2026-01-10",
      toDate: "2026-01-20",
      includedTypes: ["Exceptions", "Triggers"],
      resolvedByUsers: ["user01", "user02"],
      triggerTypes: ["TRPR0010"],
      volumeOfCases: 20
    })
  })
})
