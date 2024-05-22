import type { CourtCase } from "../phase1/types/AhoXml"
import type { PncQueryResult } from "../types/PncQueryResult"
import getCourtCaseFromQueryResults from "./getCourtCaseFromQueryResults"

describe("getCourtCaseFromQueryResults", () => {
  it("returns undefined if pnc query is undefined", () => {
    expect(getCourtCaseFromQueryResults("court-case-reference", undefined)).toBeUndefined()
  })

  it("returns the court case which matches the court case reference", () => {
    const courtCase = { courtCaseReference: "court-case-reference" } as unknown as CourtCase
    const queryResult = { courtCases: [courtCase] } as unknown as PncQueryResult

    const result = getCourtCaseFromQueryResults("court-case-reference", queryResult)

    expect(result).toEqual(courtCase)
  })

  it("returns the first court case which matches the court case reference", () => {
    const courtCase1 = { courtCaseReference: "court-case-reference" } as unknown as CourtCase
    const courtCase2 = { courtCaseReference: "court-case-reference" } as unknown as CourtCase
    const queryResult = { courtCases: [courtCase1, courtCase2] } as unknown as PncQueryResult

    const result = getCourtCaseFromQueryResults("court-case-reference", queryResult)

    expect(result).toBe(courtCase1)
  })

  it("returns undefined if court case not found", () => {
    const courtCase = { courtCaseReference: "not-the-court-case-reference" } as unknown as CourtCase
    const queryResult = { courtCases: [courtCase] } as unknown as PncQueryResult

    const result = getCourtCaseFromQueryResults("court-case-reference", queryResult)

    expect(result).toBeUndefined()
  })
})
