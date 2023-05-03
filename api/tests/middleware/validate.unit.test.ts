import { stringify } from "qs"
import type { Response, NextFunction } from "express"
import { caseListQuerySchema, validateCaseListQueryParams } from "../../src/middleware/validate"
import { createFixture } from "zod-fixture"
import type { CaseListQueryParams } from "../../src/types/CaseListQueryParams"
import type { CaseListQueryRequest } from "../../src/types/CaseListQueryRequest"

describe("validateCourtCaseListQueryParams", () => {
  it("calls the next function if query has all required fields", () => {
    const url = `example.com?${stringify({ forces: ["01"], maxPageItems: "10" })}`
    const req = { url } as unknown as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it("stores the validated query in the request object", () => {
    const url = `example.com?${stringify({ forces: ["01"], maxPageItems: "10" })}`
    const req = { url } as unknown as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(req.caseListQueryParams).toEqual({ forces: ["01"], maxPageItems: "10" })
  })

  it("returns 400 status code if forces are absent", () => {
    const url = `example.com?${stringify({ maxPageItems: "10" })}`
    const req = { url } as unknown as CaseListQueryRequest
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
    expect(next).not.toHaveBeenCalled()
  })

  it("returns 400 status code if maxPageItems are absent", () => {
    const url = `example.com?${stringify({ forces: ["01"] })}`
    const req = { url } as unknown as CaseListQueryRequest
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
    expect(next).not.toHaveBeenCalled()
  })
  it("returns 400 status code if maxPageItems is NaN", () => {
    const url = `example.com?${stringify({ forces: ["01"], maxPageItems: "not a number" })}`
    const req = { url } as unknown as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      issues: [
        {
          code: "invalid_string",
          path: ["maxPageItems"],
          message: "Invalid",
          validation: "regex"
        }
      ]
    })
    expect(next).not.toHaveBeenCalled()
  })
  it("returns 400 status code if maxPageItems is less than 10", () => {
    const url = `example.com?${stringify({ forces: ["01"], maxPageItems: "9" })}`
    const req = { url } as unknown as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      issues: [
        {
          code: "invalid_string",
          path: ["maxPageItems"],
          message: "Invalid",
          validation: "regex"
        }
      ]
    })
    expect(next).not.toHaveBeenCalled()
  })
  it("returns 400 status code if maxPageItems is greater than 100", () => {
    const url = `example.com?${stringify({ forces: ["01"], maxPageItems: "101" })}`
    const req = { url } as unknown as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      issues: [
        {
          code: "invalid_string",
          path: ["maxPageItems"],
          message: "Invalid",
          validation: "regex"
        }
      ]
    })
    expect(next).not.toHaveBeenCalled()
  })

  it("calls the next function if query has all optional fields", () => {
    const caseListQuery: CaseListQueryParams = createFixture(caseListQuerySchema)
    caseListQuery.maxPageItems = "100"
    caseListQuery.courtDateRange = [
      { from: new Date(), to: new Date() },
      { from: new Date(), to: new Date() },
      { from: new Date(), to: new Date() }
    ]
    caseListQuery.pageNum = "2"
    const url = `example.com?${stringify(caseListQuery)}`
    const req = { url } as unknown as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(next).toHaveBeenCalled()
  })
  it("returns 400 if query has an unexpected field", () => {
    const caseListQuery = createFixture(caseListQuerySchema)
    caseListQuery.maxPageItems = "100"
    caseListQuery.courtDateRange = [{ from: new Date(), to: new Date() }]
    caseListQuery.pageNum = "2"
    caseListQuery.foo = "bar"
    const url = `example.com?${stringify(caseListQuery)}`
    const req = { url } as unknown as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      issues: [
        {
          code: "unrecognized_keys",
          keys: ["foo"],
          path: [],
          message: "Unrecognized key(s) in object: 'foo'"
        }
      ]
    })
    expect(next).not.toHaveBeenCalled()
  })

  it("returns 400 if caseState is set to an unexpected value", () => {
    const caseListQuery = createFixture(caseListQuerySchema)
    caseListQuery.maxPageItems = "100"
    caseListQuery.courtDateRange = [{ from: new Date(), to: new Date() }]
    caseListQuery.pageNum = "2"
    caseListQuery.caseState = "bar"
    const url = `example.com?${stringify(caseListQuery)}`
    const req = { url } as unknown as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      issues: [
        {
          received: "bar",
          code: "invalid_enum_value",
          options: ["Resolved", "Unresolved and resolved"],
          path: ["caseState"],
          message: "Invalid enum value. Expected 'Resolved' | 'Unresolved and resolved', received 'bar'"
        }
      ]
    })
    expect(next).not.toHaveBeenCalled()
  })
  it("returns 400 if reasons is set to an unexpected value", () => {
    const caseListQuery = createFixture(caseListQuerySchema)
    caseListQuery.maxPageItems = "100"
    caseListQuery.courtDateRange = [{ from: new Date(), to: new Date() }]
    caseListQuery.pageNum = "2"
    caseListQuery.reasons = "foo"
    const url = `example.com?${stringify(caseListQuery)}`
    const req = { url } as unknown as CaseListQueryRequest
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
          received: "string",
          path: ["reasons"],
          message: "Expected array, received string"
        }
      ]
    })
    expect(next).not.toHaveBeenCalled()
  })
  it("returns 400 if urgency is set to an unexpected value", () => {
    const caseListQuery = createFixture(caseListQuerySchema)
    caseListQuery.maxPageItems = "100"
    caseListQuery.courtDateRange = [{ from: new Date(), to: new Date() }]
    caseListQuery.pageNum = "2"
    caseListQuery.urgent = "foo"
    const url = `example.com?${stringify(caseListQuery)}`
    const req = { url } as unknown as CaseListQueryRequest
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      issues: [
        {
          received: "foo",
          code: "invalid_enum_value",
          options: ["Urgent", "Non-urgent"],
          path: ["urgent"],
          message: "Invalid enum value. Expected 'Urgent' | 'Non-urgent', received 'foo'"
        }
      ]
    })
    expect(next).not.toHaveBeenCalled()
  })
})
