import { csvMetadata } from "./csvMetadata"
import type { ReportType } from "types/reports/ReportType"

jest.mock("./escapeCsvCell", () => ({
  escapeCsvCell: jest.fn((val) => `"${val}"`)
}))

jest.mock("types/reports/ReportType", () => ({
  REPORT_TYPE_MAP: {
    TEST_REPORT: "My Test Report"
  }
}))

describe("csvMetadata", () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2023-10-15T14:30:00"))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should generate a correctly formatted metadata string", () => {
    const reportType = "TEST_REPORT" as ReportType
    const result = csvMetadata(reportType, "2023-01-01", "2023-12-31")

    expect(result).toBe('"My Test Report",Date run: 15/10/2023 14:30:00,From: 01/01/2023,To: 31/12/2023')
  })

  it("should throw an error if fromDate is null", () => {
    expect(() => csvMetadata("TEST_REPORT" as ReportType, null, "2023-12-31")).toThrow("Invalid date")
  })

  it("should throw an error if toDate is null", () => {
    expect(() => csvMetadata("TEST_REPORT" as ReportType, "2023-01-01", null)).toThrow("Invalid date")
  })

  it("should throw an error if both dates are null", () => {
    expect(() => csvMetadata("TEST_REPORT" as ReportType, null, null)).toThrow("Invalid date")
  })
})
