import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
import type { ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { exceptionsReport } from "../../../../services/db/cases/reports/exceptions"
import { mockReportHandler } from "../../../../tests/helpers/mockReportHandler"
import { createReportHandler } from "../createReportHandler"
import { createReportAuditLog } from "../utils/createReportAuditLog"
import { generateExceptions } from "./generateExceptions"

jest.mock("../utils/createReportAuditLog", () => ({
  createReportAuditLog: jest.fn()
}))

jest.mock("../../../../services/db/cases/reports/exceptions", () => ({
  exceptionsReport: jest.fn()
}))

describe("generateExceptions", () => {
  let mockDatabase: DatabaseGateway
  let mockAuditLogGateway: AuditLogDynamoGateway
  let mockUser: User
  let mockQuery: ExceptionReportQuery
  let mockReply: FastifyReply
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    mockDatabase = {} as DatabaseGateway
    mockAuditLogGateway = {} as AuditLogDynamoGateway
    mockUser = { username: "resolver_user" } as User
    mockQuery = {
      exceptions: true,
      fromDate: new Date("2024-01-01"),
      toDate: new Date("2024-01-07"),
      triggers: true
    } as ExceptionReportQuery

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
      type: jest.fn().mockReturnThis()
    } as unknown as FastifyReply
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it("should successfully run the exceptions report and count nested cases for the audit log", async () => {
    const mockChunk = [
      { cases: [{}, {}], username: "user1" },
      { cases: [{}], username: "user2" }
    ] as unknown as ExceptionReportDto[]

    const expectedTotalRecords = 3 // 2 + 1

    mockReportHandler<void, ExceptionReportDto>(undefined, undefined, undefined, mockChunk)
    ;(createReportAuditLog as jest.Mock).mockResolvedValue(undefined)

    const result = await generateExceptions(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    expect(result).toBeUndefined()
    expect(createReportHandler).toHaveBeenCalledWith(exceptionsReport, expect.any(Function), expect.any(Function))

    expect(createReportAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        reportType: "exceptions",
        totalRecords: expectedTotalRecords,
        user: mockUser
      })
    )
  })

  it("should correctly identify the nested case counting logic passed to the handler", async () => {
    mockReportHandler<void, ExceptionReportDto>(undefined)

    await generateExceptions(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    const [_strategyPassed, _onStreamCompletePassed, extractCountFunction] = (createReportHandler as jest.Mock).mock
      .calls[0]

    const testChunk = [
      { cases: [1, 2, 3], username: "A" },
      { cases: [4], username: "B" }
    ] as unknown as ExceptionReportDto[]

    expect(extractCountFunction(testChunk)).toBe(4)
  })

  it("should return error if report handler fails", async () => {
    const expectedError = new Error("Database Error")
    mockReportHandler<void, ExceptionReportDto>(expectedError)

    const result = await generateExceptions(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    expect(result).toBe(expectedError)
    expect(createReportAuditLog).not.toHaveBeenCalled()
  })

  it("should catch unexpected exceptions and log to console", async () => {
    const unexpectedError = new Error("Unexpected Failure")

    mockReportHandler<void, ExceptionReportDto>(undefined, undefined, unexpectedError)

    const result = await generateExceptions(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    expect(result).toBe(unexpectedError)
    expect(consoleErrorSpy).toHaveBeenCalledWith("Stream failed, audit log not recorded", unexpectedError)
  })
})
