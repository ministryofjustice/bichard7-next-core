import type { NestedGroupedReportConfig } from "@/types/reports/Config"
import type ReportTableGroup from "@/types/reports/ReportTableGroup"
import { nestedTable } from "@/utils/tables/nestedTable"
import { getNestedReportCsvChunks } from "./getNestedReportCsvChunks"

jest.mock("@/utils/tables/nestedTable")

type TestRow = { id: string; fullName: string }

type TestTable = {
  teamName: string
  type: string
  members: TestRow[]
  totals?: { headcount: number }
}

type TestGroup = {
  region: string
  allTeams: TestTable[]
}

describe("getNestedReportCsvChunks", () => {
  const dummyConfig: NestedGroupedReportConfig<TestGroup, TestTable, TestRow> = {
    structure: "nested",
    endpoint: "",
    groupNameKey: "region",
    groupDataListKey: "allTeams",
    tableNameKey: "teamName",
    tableDataListKey: "members",
    columns: {},
    columnSelectorKey: "type",
    reportType: "user detail"
  }

  it("should handle nested data structures correctly", async () => {
    const table: ReportTableGroup<TestRow> = {
      formattedGroupName: "Group A",
      groupName: "Group A",
      tables: [
        {
          tableName: "Table A",
          formattedTableName: "Table A",
          columns: [
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
          formattedTableName: "Table B",
          columns: [
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

    ;(nestedTable as jest.Mock).mockReturnValue([table])

    const result = await getNestedReportCsvChunks([], dummyConfig, [])

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

    const result = await getNestedReportCsvChunks([], dummyConfig, [])

    expect(result).toEqual([])
  })
})
