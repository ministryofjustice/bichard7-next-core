import type { ReportData } from "@/types/reports/Config"
import bundleReportData from "@/utils/reports/bundleReportData"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { csvMetadata } from "../utils/csvMetadata"
import { createReportCsv } from "./createReportCsv"
import { getFlatReportCsvChunks } from "./getFlatReportCsvChunks"
import { getGroupReportCsvChunks } from "./getGroupReportCsvChunks"
import { getNestedReportCsvChunks } from "./getNestedReportCsvChunks"

jest.mock("./getGroupReportCsvChunks")
jest.mock("./getFlatReportCsvChunks")
jest.mock("./getNestedReportCsvChunks")
jest.mock("services/reports/utils/csvMetadata")

const mockedCsvMetadata = csvMetadata as jest.MockedFunction<typeof csvMetadata>

describe("createReportCsv Orchestrator", () => {
  const originalBlob = global.Blob
  const mockFlatData = [{ id: 1 }]
  const mockGroupedData = [{ id: 1, group: "A" }]
  const mockNestedData = [{ id: 1, nested: [{ id: 2 }] }]
  const mockMetadata = "Mocked Metadata"

  beforeEach(() => {
    jest.clearAllMocks()
    mockedCsvMetadata.mockReturnValue(mockMetadata)

    global.Blob = jest.fn().mockImplementation((content, options) => ({
      content,
      options
    })) as unknown as typeof Blob
  })

  afterAll(() => {
    global.Blob = originalBlob
  })

  it("should route to getFlatReportCsvChunks when structure is flat", async () => {
    const config = { structure: "flat" } as any
    ;(getFlatReportCsvChunks as jest.Mock).mockResolvedValue(["flat", "csv", "data"])
    const reportData = bundleReportData(config, mockFlatData) as ReportData
    await createReportCsv(reportData, "type" as ReportType, "start", "end")

    expect(getFlatReportCsvChunks).toHaveBeenCalledWith(mockFlatData, config, ["", mockMetadata, ""])
    expect(getGroupReportCsvChunks).not.toHaveBeenCalled()
    expect(getNestedReportCsvChunks).not.toHaveBeenCalled()
  })

  it("should route to getGroupReportCsvChunks when structure is grouped", async () => {
    const config = { structure: "grouped" } as any
    ;(getGroupReportCsvChunks as jest.Mock).mockResolvedValue(["header", "grouped-data"])
    const reportData = bundleReportData(config, mockGroupedData) as ReportData
    await createReportCsv(reportData, "type" as ReportType, null, null)

    expect(getGroupReportCsvChunks).toHaveBeenCalledWith(mockGroupedData, config, ["", mockMetadata, ""])
    expect(getFlatReportCsvChunks).not.toHaveBeenCalled()
    expect(getNestedReportCsvChunks).not.toHaveBeenCalled()
  })

  it("should route to getNestedReportCsvChunks when structure is nested", async () => {
    const config = { structure: "nested" } as any
    const reportData = bundleReportData(config, mockNestedData) as ReportData
    ;(getNestedReportCsvChunks as jest.Mock).mockResolvedValue(["mock", "csv", "data"])
    await createReportCsv(reportData, "type" as ReportType, null, null)

    expect(getNestedReportCsvChunks).toHaveBeenCalledWith(mockNestedData, config, ["", mockMetadata, ""])
    expect(getFlatReportCsvChunks).not.toHaveBeenCalled()
    expect(getGroupReportCsvChunks).not.toHaveBeenCalled()
  })

  it("should join csv chunks with newlines and include metadata", async () => {
    const config = { structure: "flat" } as any
    const reportData = bundleReportData(config, []) as ReportData
    const mockChunks = ["row1", "row2"]
    ;(getFlatReportCsvChunks as jest.Mock).mockResolvedValue([...["", mockMetadata, ""], ...mockChunks])

    const blob = await createReportCsv(reportData, "TEST_TYPE" as ReportType, null, null)

    const finalString = (blob as any).content.join("")

    const expected = `\uFEFF\n${mockMetadata}\n\nrow1\nrow2`
    expect(finalString).toBe(expected)
  })

  it("should pass the correct dates and report type to csvMetadata", async () => {
    const config = { structure: "flat" } as any
    ;(getFlatReportCsvChunks as jest.Mock).mockResolvedValue([])
    const reportData = bundleReportData(config, []) as ReportData

    const from = "2023-01-01"
    const to = "2023-12-31"
    const type = "USER_REPORT" as ReportType

    await createReportCsv(reportData, type, from, to)

    expect(mockedCsvMetadata).toHaveBeenCalledWith(type, from, to)
  })

  it("should produce a Blob with the correct CSV content type", async () => {
    const config = { structure: "flat" } as any
    ;(getFlatReportCsvChunks as jest.Mock).mockResolvedValue([])
    const reportData = bundleReportData(config, []) as ReportData

    const blob = await createReportCsv(reportData, "type" as ReportType, null, null)

    expect((blob as any).options).toEqual({
      type: "text/csv;charset=utf-8;"
    })
  })
})
