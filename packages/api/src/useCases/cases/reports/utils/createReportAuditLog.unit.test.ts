import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import type { User } from "@moj-bichard7/common/types/User"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { REPORT_TYPE_MAP } from "@moj-bichard7/common/types/reports/ReportType"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"

import buildAuditLogUserEvent from "../../../auditLog/buildAuditLogUserEvent"
import createAuditLogUserEvent from "../../../createAuditLogUserEvents"
import { createReportAuditLog } from "./createReportAuditLog"
import { formatDate } from "./formatDate"

jest.mock("../../../auditLog/buildAuditLogUserEvent")
jest.mock("../../../createAuditLogUserEvents")
jest.mock("./formatDate")

describe("createReportAuditLog", () => {
  let mockAuditLogGateway: AuditLogDynamoGateway
  let mockUser: User
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    mockAuditLogGateway = {} as AuditLogDynamoGateway
    mockUser = { username: "test_user_123" } as User
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it("should build and save the audit log successfully", async () => {
    const mockFromDate = new Date("2024-01-01T00:00:00Z")
    const mockToDate = new Date("2024-01-31T23:59:59Z")
    const mockDuration = 150
    const mockTotalRecords = 42
    const mockReportType: ReportType = "bails"

    const mockEvent = { eventCode: EventCode.ReportRun }
    ;(buildAuditLogUserEvent as jest.Mock).mockReturnValue(mockEvent)
    ;(createAuditLogUserEvent as jest.Mock).mockResolvedValue(undefined)
    ;(formatDate as jest.Mock).mockImplementation((date: Date) => {
      if (date === mockFromDate) {
        return "01/01/2024"
      }

      if (date === mockToDate) {
        return "31/01/2024"
      }

      return "Unknown Date"
    })

    const result = await createReportAuditLog({
      auditLogGateway: mockAuditLogGateway,
      duration: mockDuration,
      fromDate: mockFromDate,
      reportType: mockReportType,
      toDate: mockToDate,
      totalRecords: mockTotalRecords,
      user: mockUser
    })

    expect(result).toBeUndefined()

    expect(buildAuditLogUserEvent).toHaveBeenCalledWith(
      mockUser.username,
      EventCode.ReportRun,
      EventCategory.information,
      "Bichard New UI",
      {
        auditLogVersion: 2,
        "Date Range": "01/01/2024 to 31/01/2024",
        "Number of Records Returned": mockTotalRecords,
        "Output Format": "Viewed in UI",
        "Report ID": REPORT_TYPE_MAP[mockReportType],
        "Time Taken": `${mockDuration}ms`
      }
    )

    expect(createAuditLogUserEvent).toHaveBeenCalledWith([mockEvent], mockAuditLogGateway)
  })

  it("should log to console and return the error if saving the audit log fails", async () => {
    const expectedError = new Error("DynamoDB save failed")

    ;(buildAuditLogUserEvent as jest.Mock).mockReturnValue({})
    ;(createAuditLogUserEvent as jest.Mock).mockResolvedValue(expectedError)
    ;(formatDate as jest.Mock).mockReturnValue("Formatted Date")

    const result = await createReportAuditLog({
      auditLogGateway: mockAuditLogGateway,
      duration: 100,
      reportType: "warrants",
      totalRecords: 0,
      user: mockUser
    })

    expect(result).toBe(expectedError)
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to save audit log", expectedError)
    expect(createAuditLogUserEvent).toHaveBeenCalledTimes(1)
  })
})
