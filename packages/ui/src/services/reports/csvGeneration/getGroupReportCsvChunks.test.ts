import type { GroupedReportConfig } from "@/types/reports/Config"
import type ReportTable from "@/types/reports/ReportTable"
import { groupTable } from "@/utils/tables/groupTable"
import { getGroupReportCsvChunks } from "./getGroupReportCsvChunks"

jest.mock("@/utils/tables/groupTable")

type TestRow = { id: string; name: string }

type TestGroup = {
  teamName: string
  members: TestRow[]
  totals?: { headcount: number }
}

describe("getGroupReportCsvChunks", () => {
  const groupConfig: GroupedReportConfig<TestGroup, TestRow> = {
    endpoint: "",
    structure: "grouped",
    groupNameKey: "teamName",
    dataListKey: "members",
    columns: [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" }
    ],
    reportType: "user summary"
  }

  it("should handle grouped data structures correctly", async () => {
    const table: ReportTable<TestRow> = {
      formattedTableName: "Court A",
      tableName: "Court A",
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" }
      ],
      rows: [
        { id: "10", name: "Case 1" },
        { id: "11", name: "Case 2" }
      ],
      tableConfig: {
        structure: "flat",
        columns: [
          { header: "ID", key: "id" },
          { header: "Name", key: "name" }
        ],
        endpoint: "",
        reportType: "user detail"
      }
    }

    ;(groupTable as jest.Mock).mockReturnValue([table])

    const result = await getGroupReportCsvChunks([], groupConfig, [])

    expect(result).toEqual(['"","Court A"', '"ID","Name"', '"10","Case 1"', '"11","Case 2"'])
  })
})
