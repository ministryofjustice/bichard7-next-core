import type { GroupedReportConfig } from "@/types/reports/Config"
import { groupTable } from "@/utils/tables/groupTable"
import { getGroupReportCsvChunks } from "./getGroupReportCsvChunks"

jest.mock("@/utils/tables/groupTable")

describe("getGroupReportCsvChunks", () => {
  const groupConfig = {
    endpoint: "",
    structure: "grouped",
    groupNameKey: "",
    dataListKey: "",
    columns: [{}]
  } as GroupedReportConfig<any, any>

  it("should handle grouped data structures correctly", async () => {
    ;(groupTable as jest.Mock).mockReturnValue([
      {
        formattedTableName: "Court A",
        columns: [
          { header: "ID", key: "id" },
          { header: "Name", key: "name" }
        ],
        rows: [
          { id: "10", name: "Case 1" },
          { id: "11", name: "Case 2" }
        ]
      }
    ])

    const result = await getGroupReportCsvChunks([], groupConfig, [])

    expect(result).toEqual(['"","Court A"', '"ID","Name"', '"10","Case 1"', '"11","Case 2"'])
  })

  it("should skip chunk generation if rows is not an array", async () => {
    ;(groupTable as jest.Mock).mockReturnValue([
      {
        formattedTableName: "Court A",
        tableConfig: {
          columns: [
            { header: "ID", key: "id" },
            { header: "Name", key: "name" }
          ]
        },
        rows: null
      }
    ])

    const result = await getGroupReportCsvChunks([], groupConfig, [])

    expect(result).toEqual(['"","Court A"', '"ID","Name"'])
  })
})
