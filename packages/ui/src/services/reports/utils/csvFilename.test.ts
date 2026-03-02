import { csvFilename } from "./csvFilename"
import { format } from "date-fns"
import type { ReportType } from "types/reports/ReportType"

jest.mock("date-fns", () => ({
  format: jest.fn()
}))
const mockedFormat = format as jest.MockedFunction<typeof format>

jest.mock("types/reports/ReportType", () => ({
  REPORT_TYPE_MAP: {
    TEST_REPORT: "My Awesome Report",
    NO_SPACES: "Singleword"
  }
}))

describe("csvFilename", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should generate a correctly formatted filename when valid dates are provided", () => {
    mockedFormat.mockReturnValueOnce("31-12-2023").mockReturnValueOnce("01-01-2023")

    const query = new URLSearchParams("fromDate=2023-01-01&toDate=2023-12-31")
    const reportType = "TEST_REPORT" as ReportType

    const result = csvFilename(reportType, query)

    expect(mockedFormat).toHaveBeenNthCalledWith(1, "2023-12-31", "dd-MM-yyyy")
    expect(mockedFormat).toHaveBeenNthCalledWith(2, "2023-01-01", "dd-MM-yyyy")

    expect(result).toBe("report-my-awesome-report-01-01-2023-to-31-12-2023.csv")
  })

  it("should handle report types that do not contain spaces", () => {
    mockedFormat.mockReturnValue("01-01-2023")

    const query = new URLSearchParams("fromDate=2023-01-01&toDate=2023-01-01")
    const result = csvFilename("NO_SPACES" as ReportType, query)

    expect(result).toBe("report-singleword-01-01-2023-to-01-01-2023.csv")
  })

  it("should throw an error if fromDate is missing", () => {
    const query = new URLSearchParams("toDate=2023-12-31")

    expect(() => csvFilename("TEST_REPORT" as ReportType, query)).toThrow("No valid dates")
  })

  it("should throw an error if toDate is missing", () => {
    const query = new URLSearchParams("fromDate=2023-01-01")

    expect(() => csvFilename("TEST_REPORT" as ReportType, query)).toThrow("No valid dates")
  })

  it("should throw an error if both dates are missing", () => {
    const query = new URLSearchParams()

    expect(() => csvFilename("TEST_REPORT" as ReportType, query)).toThrow("No valid dates")
  })
})
