import type { NextFunction, Response } from "express"
import { createFixture } from "zod-fixture"
import { caseListQuerySchema, validateCaseListQueryParams } from "../../src/middleware/validate"
import type { CaseListQueryRequest } from "../../src/types/CaseListQueryRequest"

const createTestQuery = () => {
  const caseListQuery = createFixture(caseListQuerySchema)
  caseListQuery.courtDateRange = [{ from: new Date().toISOString(), to: new Date().toISOString() }]
  caseListQuery.maxPageItems = "100"
  caseListQuery.pageNum = "1"
  return caseListQuery
}

describe("validateCourtCaseListQueryParams", () => {
  it("calls the next function if query has all required fields", () => {
    const req = { query: { forces: ["01"], maxPageItems: "10" } } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it("stores the validated query in the request object", () => {
    const req = { query: { forces: ["01"], maxPageItems: "10" } } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(req.caseListQueryParams).toEqual({ forces: ["01"], maxPageItems: "10" })
  })

  it("returns 400 status code if forces are absent", () => {
    const req = { query: { maxPageItems: "10" } } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
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
    const req = { query: { forces: ["01"] } } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
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
    const req = {
      query: { forces: ["01"], maxPageItems: "Not a number" }
    } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
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
    const req = {
      query: { forces: ["01"], maxPageItems: "9" }
    } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
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
    const req = {
      query: { forces: ["01"], maxPageItems: "101" }
    } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
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
    const caseListQuery = createTestQuery()
    const req = {
      query: caseListQuery
    } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
    const next = jest.fn() as NextFunction

    validateCaseListQueryParams(req, res, next)

    expect(next).toHaveBeenCalled()
  })
  it("returns 400 if query has an unexpected field", () => {
    const caseListQuery = createTestQuery()
    caseListQuery.foo = "bar"
    const req = {
      query: caseListQuery
    } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
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
    const caseListQuery = createTestQuery()
    caseListQuery.caseState = "bar"
    const req = {
      query: caseListQuery
    } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
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
    const caseListQuery = createTestQuery()
    caseListQuery.reasons = "foo"
    const req = {
      query: caseListQuery
    } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
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
    const caseListQuery = createTestQuery()
    caseListQuery.urgent = "foo"
    const req = {
      query: caseListQuery
    } as unknown as CaseListQueryRequest
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response
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
