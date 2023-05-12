import type { Response } from "express"
import { getCourtCases } from "../src/controllers/courtCases"
import CourtCase from "../src/services/entities/CourtCase"
import getDataSource from "../src/services/getDataSource"
import listCourtCases from "../src/services/listCourtCases"
import type { CaseListQueryRequest } from "../src/types/CaseListQueryRequest"
import type { ListCourtCaseResult } from "../src/types/ListCourtCasesResult"

jest.mock("../src/services/getDataSource")
jest.mock("../src/services/listCourtCases", () => jest.fn())
;(getDataSource as jest.Mock).mockReturnValue({
  destroy: jest.fn()
})

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

  it("returns a 500 status code when database returns an error", async () => {
    const expectedError = new Error("Something went wrong")
    ;(listCourtCases as jest.Mock).mockReturnValue(Promise.resolve(expectedError))
    const req = { caseListQueryParams: { forces: ["01"], maxPageItems: "10" } } as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)

    await getCourtCases(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expectedError)
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
