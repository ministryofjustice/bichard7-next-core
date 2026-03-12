import type { DomesticViolenceReportQuery } from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { mockReportHandler } from "../../../../tests/helpers/mockReportHandler"
import { createReportAuditLog } from "../utils/createReportAuditLog"
import { generateDomesticViolenceReport } from "./generateDomesticViolenceReport"

jest.mock("../utils/createReportAuditLog", () => ({
  createReportAuditLog: jest.fn()
}))

jest.mock("../../../../services/db/cases/reports/domesticViolence", () => ({
  domesticViolenceReport: jest.fn()
}))

describe("generateDomesticViolenceReport", () => {
  let mockDatabase: DatabaseGateway
  let mockAuditLogGateway: AuditLogDynamoGateway
  let mockUser: User
  let mockQuery: DomesticViolenceReportQuery
  let mockReply: FastifyReply
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    mockDatabase = {} as DatabaseGateway
    mockAuditLogGateway = {} as AuditLogDynamoGateway
    mockUser = { username: "test_user_123" } as User

    mockQuery = {
      fromDate: new Date("2024-01-01T00:00:00.000Z"),
      toDate: new Date("2024-01-31T23:59:59.000Z")
    } as DomesticViolenceReportQuery

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
      type: jest.fn().mockReturnThis()
    } as unknown as FastifyReply
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it("should successfully run the report, capture the total count, and call createReportAuditLog", async () => {
    const expectedRecordCount = 42
    mockReportHandler(undefined, expectedRecordCount)
    ;(createReportAuditLog as jest.Mock).mockResolvedValue(undefined)

    const result = await generateDomesticViolenceReport(
      mockDatabase,
      mockAuditLogGateway,
      mockUser,
      mockQuery,
      mockReply
    )

    expect(result).toBeUndefined()

    expect(createReportAuditLog).toHaveBeenCalledWith({
      auditLogGateway: mockAuditLogGateway,
      duration: expect.any(Number),
      fromDate: mockQuery.fromDate,
      reportType: "domestic violence",
      toDate: mockQuery.toDate,
      totalRecords: expectedRecordCount,
      user: mockUser
    })
  })

  it("should return the error and skip audit logging if the report handler returns an error", async () => {
    const expectedError = new Error("Permission Denied")
    mockReportHandler(expectedError)

    const result = await generateDomesticViolenceReport(
      mockDatabase,
      mockAuditLogGateway,
      mockUser,
      mockQuery,
      mockReply
    )

    expect(result).toBe(expectedError)
    expect(createReportAuditLog).not.toHaveBeenCalled()
  })

  it("should return the error if saving the audit log event fails", async () => {
    mockReportHandler(undefined, 10)

    const auditLogError = new Error("DynamoDB Timeout")
    ;(createReportAuditLog as jest.Mock).mockResolvedValue(auditLogError)

    const result = await generateDomesticViolenceReport(
      mockDatabase,
      mockAuditLogGateway,
      mockUser,
      mockQuery,
      mockReply
    )

    expect(result).toEqual(auditLogError)
    expect(createReportAuditLog).toHaveBeenCalledTimes(1)
  })

  it("should catch unexpected exceptions, log to console, and return an Error object", async () => {
    const unexpectedException = new Error("Unexpected database connection drop")
    mockReportHandler(undefined, undefined, unexpectedException)

    const result = await generateDomesticViolenceReport(
      mockDatabase,
      mockAuditLogGateway,
      mockUser,
      mockQuery,
      mockReply
    )

    expect(result).toBe(unexpectedException)
    expect(consoleErrorSpy).toHaveBeenCalledWith("Stream failed, audit log not recorded", unexpectedException)
    expect(createReportAuditLog).not.toHaveBeenCalled()
  })
})
