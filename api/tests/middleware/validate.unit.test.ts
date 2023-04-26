import type { Request, Response, NextFunction } from "express"
import { validateCaseListQueryParams } from "../../src/middleware/validate"

describe("validateCourtCaseListQueryParams", () => {
  it("call the next function if query has all required fields", () => {
    const req = { query: { forces: ["01"], maxPageItems: "10" } } as unknown as Request
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
