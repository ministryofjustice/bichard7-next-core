import { escapeCsvCell } from "services/reports/utils/escapeCsvCell"
import { getFlatReportCsvChunks } from "./getFlatReportCsvChunks"

jest.mock("services/reports/utils/escapeCsvCell")

describe("getFlatReportCsvChunks", () => {
  const mockedEscapeCsvCell = escapeCsvCell as jest.MockedFunction<typeof escapeCsvCell>

  beforeEach(() => {
    mockedEscapeCsvCell.mockImplementation((val) => String(val))
  })

  it("should append flat data rows to the initial chunks", async () => {
    const initialChunks = ["", "Metadata", ""]
    const config = {
      structure: "flat",
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" }
      ]
    } as any
    const data = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" }
    ]

    const result = await getFlatReportCsvChunks(data, config, initialChunks)

    expect(result).toEqual(["", "Metadata", "", "ID,Name", "1,Alice", "2,Bob"])
  })
})
