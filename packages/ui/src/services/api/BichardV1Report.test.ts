import BichardV1Report from "./BichardV1Report"
import ReportsApiClient from "services/api/ReportsApiClient"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { generateUrlSearchParams } from "services/api/utils/generateUrlSearchParams"
import type { AnyReportQuery } from "services/api/interfaces/BichardReportGateway"

jest.mock("services/api/ReportsApiClient")
jest.mock("services/api/utils/generateUrlSearchParams")

const mockedGenerateUrlSearchParams = generateUrlSearchParams as jest.Mock

describe("BichardV1Report", () => {
  let mockClient: jest.Mocked<ReportsApiClient>
  let reportGateway: BichardV1Report
  const mockDateQuery = { fromDate: new Date("2024-01-01"), toDate: new Date("2024-01-31") }

  beforeEach(() => {
    jest.clearAllMocks()

    mockClient = new ReportsApiClient("jwt") as jest.Mocked<ReportsApiClient>
    reportGateway = new BichardV1Report(mockClient)

    mockClient.fetchReport.mockImplementation(async function* () {
      yield "mock-report-data"
    })

    mockedGenerateUrlSearchParams.mockReturnValue("mocked=params")
  })

  describe("streamReport router", () => {
    it("should route 'bails' correctly", () => {
      const spy = jest.spyOn(reportGateway, "bailsReport")
      reportGateway.reportStrategy("bails", mockDateQuery as AnyReportQuery)
      expect(spy).toHaveBeenCalledWith(mockDateQuery)
    })

    it("should route 'exceptions' correctly", () => {
      const spy = jest.spyOn(reportGateway, "exceptionsReport")
      reportGateway.reportStrategy("exceptions", mockDateQuery as AnyReportQuery)
      expect(spy).toHaveBeenCalledWith(mockDateQuery)
    })

    it("should route 'domestic violence' correctly", () => {
      const spy = jest.spyOn(reportGateway, "domesticViolenceReport")
      reportGateway.reportStrategy("domestic violence", mockDateQuery as AnyReportQuery)
      expect(spy).toHaveBeenCalledWith(mockDateQuery)
    })

    it("should route 'warrants' correctly", () => {
      const spy = jest.spyOn(reportGateway, "warrantsReport")
      reportGateway.reportStrategy("warrants", mockDateQuery as AnyReportQuery)
      expect(spy).toHaveBeenCalledWith(mockDateQuery)
    })

    it("should return an Error for an unknown report type", () => {
      const result = reportGateway.reportStrategy("unknown-type" as any, mockDateQuery as AnyReportQuery)
      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe("Unknown report type: unknown-type")
    })
  })

  describe("Specific Report Generators", () => {
    const consumeGenerator = async (generator: AsyncIterable<any>) => {
      const results = []
      for await (const item of generator) {
        results.push(item)
      }

      return results
    }

    it("bailsReport should format URL and yield data", async () => {
      const generator = reportGateway.bailsReport(mockDateQuery)
      const results = await consumeGenerator(generator)

      expect(mockedGenerateUrlSearchParams).toHaveBeenCalledWith(mockDateQuery)
      expect(mockClient.fetchReport).toHaveBeenCalledWith(`${V1.CasesReportsBails}?mocked=params`)
      expect(results).toEqual(["mock-report-data"])
    })

    it("exceptionsReport should format URL and yield data", async () => {
      const mockQuery = {
        fromDate: new Date("2024-01-01"),
        toDate: new Date("2024-01-31"),
        exceptions: true,
        triggers: true
      }
      const generator = reportGateway.exceptionsReport(mockQuery)
      const results = await consumeGenerator(generator)

      expect(mockClient.fetchReport).toHaveBeenCalledWith(`${V1.CasesReportsExceptions}?mocked=params`)
      expect(results).toEqual(["mock-report-data"])
    })

    it("should catch an error inside the generator and yield it", async () => {
      mockClient.fetchReport.mockImplementation(() => {
        throw new Error("Synchronous setup failure")
      })

      const generator = reportGateway.warrantsReport(mockDateQuery)
      const results = await consumeGenerator(generator)

      expect(results).toHaveLength(1)
      expect(results[0]).toBeInstanceOf(Error)
      expect((results[0] as Error).message).toBe("Synchronous setup failure")
    })
  })
})
