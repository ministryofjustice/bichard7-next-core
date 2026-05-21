import type { FlatReportConfig } from "@/types/reports/Config"
import { escapeCsvCell } from "services/reports/utils/escapeCsvCell"
import { getFlatReportCsvChunks } from "./getFlatReportCsvChunks"

jest.mock("services/reports/utils/escapeCsvCell")

type TestRow = { id: string; name: string }

describe("getFlatReportCsvChunks", () => {
  const mockedEscapeCsvCell = escapeCsvCell as jest.MockedFunction<typeof escapeCsvCell>

  beforeEach(() => {
    mockedEscapeCsvCell.mockImplementation((val) => String(val))
  })

  it("should append flat data rows to the initial chunks", async () => {
    const config: FlatReportConfig<TestRow> = {
      structure: "flat",
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" }
      ],
      endpoint: "",
      reportType: "bails"
    }
    const data: TestRow[] = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" }
    ]

    const result = await getFlatReportCsvChunks(data, config, [])

    expect(result).toEqual(["ID,Name", "1,Alice", "2,Bob"])
  })
})
