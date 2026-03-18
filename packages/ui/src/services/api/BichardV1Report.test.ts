import BichardV1Report from "./BichardV1Report"
import type ReportsApiClient from "services/api/ReportsApiClient"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"

const reportTestCases: [ReportType, string][] = [
  ["bails", V1.CasesReportsBails],
  ["exceptions", V1.CasesReportsExceptions],
  ["warrants", V1.CasesReportsWarrants],
  ["domestic violence", V1.CasesReportsDomesticViolence]
]

describe("BichardV1Report", () => {
  let reportGateway: BichardV1Report
  let mockApiClient: jest.Mocked<ReportsApiClient>

  const mockQuery = {
    fromDate: new Date("2023-01-01"),
    toDate: new Date("2023-01-31"),
    exceptions: true,
    triggers: true
  }

  beforeEach(() => {
    mockApiClient = {
      fetchReport: jest.fn()
    } as unknown as jest.Mocked<ReportsApiClient>

    reportGateway = new BichardV1Report(mockApiClient)
  })

  test.each(reportTestCases)("should route %s report to the correct endpoint", async (reportType, expectedEndpoint) => {
    mockApiClient.fetchReport.mockReturnValue((async function* () {})())

    const result = reportGateway.reportStrategy(reportType, mockQuery)

    if (isError(result)) {
      throw new Error("Should not error")
    }

    for await (const _ of result) {
      // Need to run generator for the test to work
    }

    expect(mockApiClient.fetchReport).toHaveBeenCalledWith(expect.stringContaining(expectedEndpoint))
    expect(mockApiClient.fetchReport).toHaveBeenCalledWith(expect.stringContaining("fromDate"))
    expect(mockApiClient.fetchReport).toHaveBeenCalledWith(expect.stringContaining("toDate"))

    if (reportType === "exceptions") {
      expect(mockApiClient.fetchReport).toHaveBeenCalledWith(expect.stringContaining("exceptions=true"))
      expect(mockApiClient.fetchReport).toHaveBeenCalledWith(expect.stringContaining("triggers=true"))
    }
  })

  it("should return an Error if an unknown report type is provided", () => {
    const result = reportGateway.reportStrategy("invalid-report" as any, mockQuery)

    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe("Unknown report type: invalid-report")
  })

  it("should yield an error if the API client throws", async () => {
    const apiError = new Error("API Failure")
    mockApiClient.fetchReport.mockImplementation(() => {
      throw apiError
    })

    const stream = reportGateway.reportStrategy("warrants", mockQuery)

    if (!(stream instanceof Error)) {
      const chunks = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      expect(chunks[0]).toBe(apiError)
    }
  })
})
