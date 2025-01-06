import type { CaseDB } from "@moj-bichard7/common/types/Case"

import errorStatusFromCaseDB from "./errorStatusFromCaseDB"

describe("errorStatusFromCaseDB", () => {
  it("returns Unresolved when errorStatus is null", () => {
    const caseDb = { error_status: null } as unknown as CaseDB

    const result = errorStatusFromCaseDB(caseDb)

    expect(result).toBe("Unresolved")
  })

  it("returns Unresolved when errorStatus is 1", () => {
    const caseDb = { error_status: 1 } as unknown as CaseDB

    const result = errorStatusFromCaseDB(caseDb)

    expect(result).toBe("Unresolved")
  })

  it("returns Resolved when errorStatus is 2", () => {
    const caseDb = { error_status: 2 } as unknown as CaseDB

    const result = errorStatusFromCaseDB(caseDb)

    expect(result).toBe("Resolved")
  })

  it("returns Submitted when errorStatus is 3", () => {
    const caseDb = { error_status: 3 } as unknown as CaseDB

    const result = errorStatusFromCaseDB(caseDb)

    expect(result).toBe("Submitted")
  })
})
