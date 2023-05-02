import type { Response } from "express"
import type { CaseListQueryRequest } from "../src/types/CaseListQueryRequest"
import listCourtCases from "../src/services/listCourtCases"
import { getCourtCases } from "../src/controllers/courtCases"
import type { ListCourtCaseResult } from "../src/types/ListCourtCasesResult"
import CourtCase from "../src/services/entities/CourtCase"

jest.mock("../src/services/getDataSource")
jest.mock("../src/services/listCourtCases", () => jest.fn())

describe("getCourtCases", () => {
  it("returns a 200 status code", async () => {
    ;(listCourtCases as jest.Mock).mockReturnValue(Promise.resolve({ result: [], totalCases: 0 }))
    const req = { caseListQueryParams: { forces: ["01"], maxPageItems: "10" } } as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)

    await getCourtCases(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
  })

  it("returns the court cases from the database", async () => {
    const expected = {
      result: [new CourtCase(), new CourtCase(), new CourtCase()],
      totalCases: 3
    } as ListCourtCaseResult
    ;(listCourtCases as jest.Mock).mockReturnValue(Promise.resolve(expected))
    const req = { caseListQueryParams: { forces: ["01"], maxPageItems: "10" } } as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)

    await getCourtCases(req, res)

    expect(res.json).toHaveBeenCalledWith(expected)
  })
})
