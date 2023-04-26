import type { Request, Response, NextFunction } from "express"
import { validateCaseListQueryParams } from "../../src/middleware/validate"

describe("validateCourtCaseListQueryParams", () => {
  it("calls the next function if query has all required fields", () => {
    const req = { query: { forces: ["01"], maxPageItems: "10" } } as unknown as Request
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it("returns 400 status code if forces are absent", () => {
    const req = { query: { maxPageItems: "10" } } as unknown as Request
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      issues: [
        {
          code: "invalid_type",
          expected: "array",
          received: "undefined",
          path: ["forces"],
          message: "Required"
        }
      ]
    })
  })

  it("returns 400 status code if maxPageItems are absent", () => {
    const req = { query: { forces: ["01"] } } as unknown as Request
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      issues: [
        {
          code: "invalid_type",
          expected: "string",
          received: "undefined",
          path: ["maxPageItems"],
          message: "Required"
        }
      ]
    })
  })

  it("calls the next function if query has all optional fields", () => {
    const req = {
      query: {
        forces: ["01"],
        maxPageItems: "10",
        orderBy: "a column",
        order: "desc",
        reasons: ["Triggers"],
        defendantName: "WAYNE Bruce",
        courtName: "A court",
        ptiurn: "PTIURN",
        urgent: "Urgent",
        pageNum: "1",
        courtDateRange: [
          { from: new Date(), to: new Date() },
          { from: new Date(), to: new Date() }
        ],
        locked: true,
        caseState: "Resolved",
        allocatedToUserName: "a user",
        reasonCode: "reasonCode",
        resolvedByUsername: "resolvedBy"
      }
    } as unknown as Request
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})

// all optional fields then next will get called
// send something not expecting, send 400
