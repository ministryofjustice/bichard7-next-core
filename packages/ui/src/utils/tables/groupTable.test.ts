import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { isRecord } from "@/services/reports/utils/isRecord"
import { isRecordArray } from "@/services/reports/utils/isRecordArray"
import type { GroupedReportConfig } from "@/types/reports/Config"
import { groupTable } from "./groupTable"

jest.mock("@/services/reports/utils/ensureString")
jest.mock("@/services/reports/utils/formatGroupName")
jest.mock("@/services/reports/utils/isRecord")
jest.mock("@/services/reports/utils/isRecordArray")

const mockedEnsureString = ensureString as jest.MockedFunction<typeof ensureString>
const mockedFormatGroupName = formatGroupName as jest.MockedFunction<typeof formatGroupName>
const mockedIsRecord = isRecord as jest.MockedFunction<typeof isRecord>
const mockedIsRecordArray = isRecordArray as jest.MockedFunction<typeof isRecordArray>

type TestRow = { id: string }

type TestGroup = {
  group: string
  rows: TestRow[]
  totals?: { total: number }
}

describe("groupTable", () => {
  const mockConfig: GroupedReportConfig<TestGroup, TestRow> = {
    structure: "grouped",
    groupNameKey: "group",
    dataListKey: "rows",
    formatter: "date",
    columns: [{ header: "ID", key: "id" }],
    reportType: "user summary",
    endpoint: ""
  }

  const mockGroups = [
    {
      group: "Group A",
      rows: [{ id: "1" }, { id: "2" }],
      totals: { total: 2 }
    },
    {
      group: "Group B",
      rows: [{ id: "3" }],
      totals: { total: 1 }
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()

    mockedEnsureString.mockImplementation((val) => String(val))
    mockedIsRecordArray.mockImplementation((val) => Array.isArray(val))
    mockedIsRecord.mockImplementation((val) => val !== null && typeof val === "object" && !Array.isArray(val))
    mockedFormatGroupName.mockImplementation((cfg, name) => `Formatted ${name}`)
  })

  it("should correctly map groups and their associated rows", () => {
    const result = groupTable({ config: mockConfig, groups: mockGroups })

    expect(result).toHaveLength(2)

    expect(result![0]).toEqual({
      tableName: "Group A",
      formattedTableName: "Formatted Group A",
      rows: [{ id: "1" }, { id: "2" }],
      columns: [{ header: "ID", key: "id" }],
      totals: { total: 2 },
      tableConfig: {
        structure: "flat",
        columns: [{ header: "ID", key: "id" }],
        endpoint: "",
        reportType: "user summary"
      }
    })

    expect(result![1]).toEqual({
      tableName: "Group B",
      formattedTableName: "Formatted Group B",
      rows: [{ id: "3" }],
      columns: [{ header: "ID", key: "id" }],
      totals: { total: 1 },
      tableConfig: {
        structure: "flat",
        columns: [{ header: "ID", key: "id" }],
        endpoint: "",
        reportType: "user summary"
      }
    })
  })

  it("should bypass formatGroupName if no formatter is provided in config", () => {
    const noFormatConfig = { ...mockConfig, formatter: undefined }
    const result = groupTable({ config: noFormatConfig, groups: mockGroups })

    expect(result![0].tableName).toBe("Group A")
    expect(mockedFormatGroupName).not.toHaveBeenCalled()
  })

  it("should filter out invalid rows using isRecord", () => {
    const groups = [
      {
        group: "Group A",
        rows: [{ id: "1" }, "not-a-record", null, { id: "2" }]
      }
    ]

    const result = groupTable({ config: mockConfig, groups: groups as any })

    expect(result![0].rows).toHaveLength(2)
    expect(result![0].rows).toEqual([{ id: "1" }, { id: "2" }])
  })

  it("should handle missing data lists by defaulting to an empty array", () => {
    const brokenGroups = [
      {
        group: "Empty",
        rows: undefined
      }
    ]
    mockedIsRecordArray.mockReturnValue(false)

    const result = groupTable({ config: mockConfig, groups: brokenGroups as any })

    expect(result![0].rows).toEqual([])
  })

  it("should set totals to undefined if group.totals is not a record", () => {
    const noTotalsGroup = [
      {
        group: "No Totals",
        rows: [],
        totals: "not-an-object"
      }
    ]

    mockedIsRecord.mockImplementation((val) => typeof val === "object" && val !== null)

    const result = groupTable({ config: mockConfig, groups: noTotalsGroup as any })

    expect(result![0].totals).toBeUndefined()
  })
})
