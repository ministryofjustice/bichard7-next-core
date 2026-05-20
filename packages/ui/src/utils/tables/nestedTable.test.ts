import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { getMappedColumns } from "@/services/reports/utils/getMappedColumns"
import { isRecord } from "@/services/reports/utils/isRecord"
import { isRecordArray } from "@/services/reports/utils/isRecordArray"
import type { NestedGroupedReportConfig } from "@/types/reports/Config"
import { nestedTable } from "./nestedTable"

jest.mock("@/services/reports/utils/ensureString")
jest.mock("@/services/reports/utils/formatGroupName")
jest.mock("@/services/reports/utils/getMappedColumns")
jest.mock("@/services/reports/utils/isRecord")
jest.mock("@/services/reports/utils/isRecordArray")

const mockedIsRecord = isRecord as jest.MockedFunction<typeof isRecord>
const mockedGetMappedColumns = getMappedColumns as jest.MockedFunction<typeof getMappedColumns>
const mockedEnsureString = ensureString as jest.MockedFunction<typeof ensureString>
const mockedIsRecordArray = isRecordArray as jest.MockedFunction<typeof isRecordArray>
const mockedFormatGroupName = formatGroupName as jest.MockedFunction<typeof formatGroupName>

type TestRow = { id: number }

type TestInnerGroup = {
  tableName: string
  type: string
  rows: TestRow[]
  totals?: { total: number }
}

type TestOuterGroup = {
  group: string
  tables: TestInnerGroup[]
}

describe("nestedTable", () => {
  const mockConfig: NestedGroupedReportConfig<TestOuterGroup, TestInnerGroup, TestRow> = {
    structure: "nested",
    endpoint: "test",
    groupNameKey: "group",
    groupDataListKey: "tables",
    tableNameKey: "tableName",
    tableDataListKey: "rows",
    columns: {
      typeA: [{ header: "ID_A", key: "id" }],
      typeB: [{ header: "ID_B", key: "id" }]
    },
    columnSelectorKey: "type",
    totalsConfig: [{ key: "total", label: "Total" }],
    reportType: "user detail",
    formatter: "date"
  }

  const mockGroups = [
    {
      group: "Group A",
      tables: [
        {
          tableName: "Table A",
          type: "typeA",
          rows: [{ id: 1 }, { id: 2 }],
          totals: { total: 50 }
        },
        {
          tableName: "Table B",
          type: "typeB",
          rows: [{ id: 2 }, { id: 3 }],
          totals: { total: 100 }
        }
      ]
    },
    {
      group: "Group B",
      tables: [
        {
          tableName: "Table A",
          type: "typeA",
          rows: [{ id: 1 }, { id: 2 }],
          totals: { total: 50 }
        },
        {
          tableName: "Table B",
          type: "typeB",
          rows: [{ id: 2 }, { id: 3 }],
          totals: { total: 100 }
        }
      ]
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()

    mockedEnsureString.mockImplementation((val) => String(val))
    mockedIsRecordArray.mockImplementation((val) => Array.isArray(val))
    mockedFormatGroupName.mockImplementation((cfg, name) => `Formatted ${name}`)
    mockedIsRecord.mockReturnValue(true)
    mockedGetMappedColumns.mockImplementation((config, innerGroup) => {
      const selectorValue = innerGroup[config.columnSelectorKey] as string
      return (config.columns as any)[selectorValue] || []
    })
  })

  it("should transform nested groups into the expected report structure", () => {
    const result = nestedTable({ config: mockConfig, groups: mockGroups })

    expect(result).toHaveLength(2)
    for (let groupIndex = 0; groupIndex < 2; groupIndex++) {
      const group = result![groupIndex]
      expect(group.groupName).toBe(groupIndex === 0 ? "Group A" : "Group B")
      expect(group.formattedGroupName).toBe(groupIndex === 0 ? "Formatted Group A" : "Formatted Group B")
      expect(group.tables).toHaveLength(2)

      for (let tableIndex = 0; tableIndex < 2; tableIndex++) {
        const table = group.tables[tableIndex]
        expect(table.tableName).toBe(tableIndex == 0 ? "Table A" : "Table B")
        expect(table.rows).toHaveLength(2)
        expect(table.totals).toEqual(tableIndex == 0 ? { total: 50 } : { total: 100 })
        expect(table.columns).toEqual(
          tableIndex == 0 ? [{ header: "ID_A", key: "id" }] : [{ header: "ID_B", key: "id" }]
        )

        expect(table.tableConfig).toEqual({
          structure: "flat",
          columns: expect.any(Array),
          endpoint: "test",
          reportType: "user detail"
        })
      }
    }
  })

  it("should filter out non-record items from groups and tables", () => {
    mockedIsRecord.mockImplementation((val) => val !== null && typeof val === "object" && !Array.isArray(val))

    const groups = [
      null,
      {
        group: "Valid Group",
        tables: ["invalid table string", { tableName: "Valid Table", rows: [{ id: 1 }, "invalid row"] }]
      }
    ]

    const result = nestedTable({ config: mockConfig, groups: groups as any })

    expect(result).toHaveLength(1)
    expect(result![0].tables).toHaveLength(1)
    expect(result![0].tables[0].rows).toHaveLength(1)
  })

  it("should handle missing optional fields like totals and row lists", () => {
    const minimalGroups = [
      {
        group: "Minimal Group",
        tables: [
          {
            tableName: "Minimal Table"
          }
        ]
      }
    ]

    const result = nestedTable({ config: mockConfig, groups: minimalGroups as any })
    const table = result![0].tables[0]

    expect(table.rows).toEqual([])
    expect(table.totals).toBeUndefined()
  })

  it("should not call formatGroupName if config.formatter is missing", () => {
    const noFormatterConfig = { ...mockConfig, formatter: undefined }

    nestedTable({ config: noFormatterConfig, groups: mockGroups })

    expect(mockedFormatGroupName).not.toHaveBeenCalled()
  })

  it("should call formatGroupName with correct arguments if formatter exists", () => {
    const configWithFormatter = { ...mockConfig, formatter: "date" } as NestedGroupedReportConfig<
      TestOuterGroup,
      TestInnerGroup,
      TestRow
    >

    nestedTable({ config: configWithFormatter, groups: [mockGroups[0]] })

    expect(mockedFormatGroupName).toHaveBeenCalledWith(configWithFormatter, "Group A")
  })

  it("should return an empty array if groups is empty", () => {
    const result = nestedTable({ config: mockConfig, groups: [] })
    expect(result).toEqual([])
  })
})
