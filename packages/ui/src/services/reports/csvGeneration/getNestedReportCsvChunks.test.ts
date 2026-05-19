import type { NestedGroupedReportConfig } from "@/types/reports/Config"
import { nestedTable } from "@/utils/tables/nestedTable"
import { getNestedReportCsvChunks } from "./getNestedReportCsvChunks"

jest.mock("@/utils/tables/nestedTable")

describe("getNestedReportCsvChunks", () => {
  const nestedConfig = {
    structure: "nested",
    endpoint: "",
    groupNameKey: "courtName",
    groupDataListKey: "codeDetails",
    tableNameKey: "description",
    tableDataListKey: "users",
    columns: {},
    columnSelectorKey: "type",
    reportType: "user detail"
  } as NestedGroupedReportConfig<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>

  it("should handle nested data structures correctly", async () => {
    ;(nestedTable as jest.Mock).mockReturnValue([
      {
        formattedGroupName: "Group A",
        tables: [
          {
            tableName: "Table A",
            mappedColumns: [
              { header: "ID_A", key: "id" },
              { header: "Name_A", key: "fullName" }
            ],
            rows: [
              {
                id: "10",
                fullName: "Case 1"
              }
            ]
          },
          {
            tableName: "Table B",
            mappedColumns: [
              { header: "ID_B", key: "id" },
              { header: "Name_B", key: "fullName" }
            ],
            rows: [
              {
                id: "11",
                fullName: "Case 2"
              }
            ]
          }
        ]
      }
    ])

    const result = await getNestedReportCsvChunks([], nestedConfig, [])

    expect(result).toEqual([
      '"","Group A","Table A"',
      '"ID_A","Name_A"',
      '"10","Case 1"',
      '"","Group A","Table B"',
      '"ID_B","Name_B"',
      '"11","Case 2"'
    ])
  })

  it("should skip table chunk generation if tables is not an array", async () => {
    ;(nestedTable as jest.Mock).mockReturnValue([
      {
        formattedGroupName: "Group A",
        tables: null
      }
    ])

    const result = await getNestedReportCsvChunks([], nestedConfig, [])

    expect(result).toEqual([])
  })

  it("should skip row chunk generation if rows within a table are not an array", async () => {
    ;(nestedTable as jest.Mock).mockReturnValue([
      {
        formattedGroupName: "Group A",
        tables: [
          {
            tableName: "Table A",
            mappedColumns: [
              { header: "ID_A", key: "id" },
              { header: "Name_A", key: "fullName" }
            ],
            rows: null
          }
        ]
      }
    ])

    const result = await getNestedReportCsvChunks([], nestedConfig, [])

    expect(result).toEqual(['"","Group A","Table A"', '"ID_A","Name_A"'])
  })
})
