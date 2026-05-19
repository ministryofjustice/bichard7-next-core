import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { csvMetadata } from "services/reports/utils/csvMetadata"
import { createReportCsv } from "./createReportCsv"
import { getFlatReportCsvChunks } from "./getFlatReportCsvChunks"
import { getGroupReportCsvChunks } from "./getGroupReportCsvChunks"
import { getNestedReportCsvChunks } from "./getNestedReportCsvChunks"

jest.mock("./getGroupReportCsvChunks")
jest.mock("./getFlatReportCsvChunks")
jest.mock("./getNestedReportCsvChunks")
jest.mock("services/reports/utils/csvMetadata")

describe("createReportCsv Orchestrator", () => {
  const mockFlatData = [{ id: 1 }]
  const mockGroupedData = [{ id: 1, group: "A" }]
  const mockNestedData = [{ id: 1, nested: [{ id: 2 }] }]
  const mockMetadata = "Mocked Metadata"

  beforeEach(() => {
    jest.clearAllMocks()
    ;(csvMetadata as jest.Mock).mockReturnValue(mockMetadata)
  })

  it("should route to getFlatReportCsvChunks when structure is flat", async () => {
    const config = { structure: "flat" } as any
    ;(getFlatReportCsvChunks as jest.Mock).mockResolvedValue(["flat", "csv", "data"])
    await createReportCsv(mockFlatData, config, "type" as ReportType, "start", "end")

    expect(getFlatReportCsvChunks).toHaveBeenCalledWith(mockFlatData, config, ["", mockMetadata, ""])
    expect(getGroupReportCsvChunks).not.toHaveBeenCalled()
    expect(getNestedReportCsvChunks).not.toHaveBeenCalled()
  })

  it("should route to getGroupReportCsvChunks when structure is grouped", async () => {
    const config = { structure: "grouped" } as any
    ;(getGroupReportCsvChunks as jest.Mock).mockResolvedValue(["header", "grouped-data"])
    await createReportCsv(mockGroupedData, config, "type" as ReportType, null, null)

    expect(getGroupReportCsvChunks).toHaveBeenCalled()
    expect(getFlatReportCsvChunks).not.toHaveBeenCalled()
    expect(getNestedReportCsvChunks).not.toHaveBeenCalled()
  })

  it("should route to getNestedReportCsvChunks when structure is nested", async () => {
    const config = { structure: "nested" } as any
    ;(getNestedReportCsvChunks as jest.Mock).mockResolvedValue(["mock", "csv", "data"])
    await createReportCsv(mockNestedData, config, "type" as ReportType, null, null)

    expect(getNestedReportCsvChunks).toHaveBeenCalled()
    expect(getFlatReportCsvChunks).not.toHaveBeenCalled()
    expect(getGroupReportCsvChunks).not.toHaveBeenCalled()
  })
})
