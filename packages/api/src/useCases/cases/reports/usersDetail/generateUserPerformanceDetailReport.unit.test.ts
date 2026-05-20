import type { UserPerformanceDetailReportQuery } from "@moj-bichard7/common/contracts/UserPerformanceDetailReportQuery"
import type {
  CodeDetailDto,
  CodeDetailUserDto,
  UserPerformanceDetailDto
} from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import { userPerformanceDetail } from "../../../../services/db/cases/reports/userPerformanceDetail"
import { createReportHandler } from "../createReportHandler"
import { createReportAuditLog } from "../utils/createReportAuditLog"
import { generateUserPerformanceDetailReport } from "./generateUserPerformanceDetailReport"

jest.mock("../../../../services/db/cases/reports/userPerformanceDetail")
jest.mock("../createReportHandler")
jest.mock("../utils/createReportAuditLog")

const mockedCreateReportHandler = createReportHandler as jest.MockedFunction<typeof createReportHandler>
const mockedCreateReportAuditLog = createReportAuditLog as jest.MockedFunction<typeof createReportAuditLog>

describe("generateUserPerformanceDetailReport", () => {
  const mockDatabase = {} as DatabaseGateway
  const mockAuditLogGateway = {} as AuditLogDynamoGateway
  const mockUser = { username: "test.user" } as User
  const mockQuery: UserPerformanceDetailReportQuery = {
    fromDate: new Date("2024-01-01"),
    toDate: new Date("2024-01-31")
  }
  const mockReply = {} as FastifyReply

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it("should call createReportHandler with userPerformanceDetail and invoke it with the correct arguments", async () => {
    const mockHandlerResult = jest.fn().mockResolvedValue(undefined)
    mockedCreateReportHandler.mockReturnValue(mockHandlerResult)

    await generateUserPerformanceDetailReport(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    expect(mockedCreateReportHandler).toHaveBeenCalledTimes(1)
    expect(mockedCreateReportHandler).toHaveBeenCalledWith(
      userPerformanceDetail,
      expect.any(Function),
      expect.any(Function)
    )

    expect(mockHandlerResult).toHaveBeenCalledWith(mockDatabase, mockUser, mockQuery, mockReply)
  })

  it("should call createReportAuditLog with the correct parameters when the audit log callback is invoked", async () => {
    const totalRecords = 42
    mockedCreateReportAuditLog.mockResolvedValue(undefined)

    let capturedAuditLogCallback!: (totalRecords: number) => Promise<void>

    mockedCreateReportHandler.mockImplementation((_reportFn: unknown, auditLogCallback: unknown) => {
      capturedAuditLogCallback = auditLogCallback as (totalRecords: number) => Promise<void>
      return jest.fn().mockResolvedValue(undefined)
    })

    jest.setSystemTime(new Date("2024-06-01T12:00:00.000Z"))

    await generateUserPerformanceDetailReport(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    jest.advanceTimersByTime(500)

    await capturedAuditLogCallback(totalRecords)

    expect(mockedCreateReportAuditLog).toHaveBeenCalledWith({
      auditLogGateway: mockAuditLogGateway,
      duration: expect.any(Number),
      fromDate: mockQuery.fromDate,
      reportType: "user detail",
      toDate: mockQuery.toDate,
      totalRecords,
      user: mockUser
    })
  })

  it("should calculate duration correctly and pass it to createReportAuditLog", async () => {
    mockedCreateReportAuditLog.mockResolvedValue(undefined)

    let capturedAuditLogCallback!: (totalRecords: number) => Promise<void>

    mockedCreateReportHandler.mockImplementation((_reportFn: unknown, auditLogCallback: unknown) => {
      capturedAuditLogCallback = auditLogCallback as (totalRecords: number) => Promise<void>
      return jest.fn().mockResolvedValue(undefined)
    })

    jest.setSystemTime(new Date("2024-06-01T12:00:00.000Z"))

    await generateUserPerformanceDetailReport(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    const advanceMs = 1234
    jest.advanceTimersByTime(advanceMs)

    await capturedAuditLogCallback(10)

    const { duration } = mockedCreateReportAuditLog.mock.calls[0][0]
    expect(duration).toBeGreaterThanOrEqual(advanceMs)
  })

  it("should count total records correctly using the chunk reducer", async () => {
    let capturedReducer!: (chunk: UserPerformanceDetailDto[]) => number

    mockedCreateReportHandler.mockImplementation((_reportFn: unknown, _auditLogCallback: unknown, reducer: unknown) => {
      capturedReducer = reducer as (chunk: UserPerformanceDetailDto[]) => number
      return jest.fn().mockResolvedValue(undefined)
    })

    await generateUserPerformanceDetailReport(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    const mockNestedUser: CodeDetailUserDto = {
      fullName: "Alice",
      id: 1,
      resolved: 5,
      totalLocked: 2,
      username: "alice.test"
    }

    const mockCodeDetail: CodeDetailDto = {
      code: "EXC01",
      description: "Test Exception",
      totals: {
        resolved: 5,
        totalLocked: 2
      },
      type: "exception",
      users: [mockNestedUser]
    }

    const mockDto: UserPerformanceDetailDto = {
      codeDetails: [mockCodeDetail],
      date: new Date()
    }

    const chunk: UserPerformanceDetailDto[] = [mockDto, mockDto, mockDto, mockDto, mockDto, mockDto]

    const result = capturedReducer(chunk)

    expect(result).toBe(6)
  })

  it("should return 0 from the chunk reducer when given an empty array", async () => {
    let capturedReducer!: (chunk: UserPerformanceDetailDto[]) => number

    mockedCreateReportHandler.mockImplementation((_reportFn: unknown, _auditLogCallback: unknown, reducer: unknown) => {
      capturedReducer = reducer as (chunk: UserPerformanceDetailDto[]) => number
      return jest.fn().mockResolvedValue(undefined)
    })

    await generateUserPerformanceDetailReport(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    expect(capturedReducer([])).toBe(0)
  })

  it("should return undefined on success", async () => {
    mockedCreateReportHandler.mockReturnValue(jest.fn().mockResolvedValue(undefined))

    const result = await generateUserPerformanceDetailReport(
      mockDatabase,
      mockAuditLogGateway,
      mockUser,
      mockQuery,
      mockReply
    )

    expect(result).toBeUndefined()
  })

  it("should catch and return errors thrown by createReportHandler", async () => {
    const mockError = new Error("Stream failed")
    mockedCreateReportHandler.mockReturnValue(jest.fn().mockRejectedValue(mockError))

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    const result = await generateUserPerformanceDetailReport(
      mockDatabase,
      mockAuditLogGateway,
      mockUser,
      mockQuery,
      mockReply
    )

    expect(result).toBe(mockError)
    consoleSpy.mockRestore()
  })

  it("should log an error message when an exception is caught", async () => {
    const mockError = new Error("Unexpected failure")
    mockedCreateReportHandler.mockReturnValue(jest.fn().mockRejectedValue(mockError))

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    await generateUserPerformanceDetailReport(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    expect(consoleSpy).toHaveBeenCalledWith("Stream failed, audit log not recorded", mockError)
    consoleSpy.mockRestore()
  })

  it("should return an audit log error if createReportAuditLog fails", async () => {
    const auditLogError = new Error("Audit log write failed")
    mockedCreateReportAuditLog.mockRejectedValue(auditLogError)

    let capturedAuditLogCallback!: (totalRecords: number) => Promise<unknown>

    mockedCreateReportHandler.mockImplementation((_reportFn: unknown, auditLogCallback: unknown) => {
      capturedAuditLogCallback = auditLogCallback as (totalRecords: number) => Promise<unknown>
      return jest.fn().mockResolvedValue(undefined)
    })

    await generateUserPerformanceDetailReport(mockDatabase, mockAuditLogGateway, mockUser, mockQuery, mockReply)

    await expect(capturedAuditLogCallback(5)).rejects.toThrow("Audit log write failed")
  })

  it("should pass fromDate and toDate from the query to createReportAuditLog", async () => {
    const customQuery: UserPerformanceDetailReportQuery = {
      fromDate: new Date("2023-03-15"),
      toDate: new Date("2023-04-15")
    }
    mockedCreateReportAuditLog.mockResolvedValue(undefined)

    let capturedAuditLogCallback!: (totalRecords: number) => Promise<void>

    mockedCreateReportHandler.mockImplementation((_reportFn: unknown, auditLogCallback: unknown) => {
      capturedAuditLogCallback = auditLogCallback as (totalRecords: number) => Promise<void>
      return jest.fn().mockResolvedValue(undefined)
    })

    await generateUserPerformanceDetailReport(mockDatabase, mockAuditLogGateway, mockUser, customQuery, mockReply)

    await capturedAuditLogCallback(1)

    expect(mockedCreateReportAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        fromDate: new Date("2023-03-15"),
        toDate: new Date("2023-04-15")
      })
    )
  })
})
