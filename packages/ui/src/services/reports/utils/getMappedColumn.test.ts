import type { NestedGroupedReportConfig } from "@/types/reports/Config"
import { getMappedColumns } from "./getMappedColumns"

describe("getMappedColumns", () => {
  const mockColumnsA = [{ header: "Column A", key: "a" }]
  const mockColumnsB = [{ header: "Column B", key: "b" }]

  const dynamicColumns = {
    TypeA: mockColumnsA,
    TypeB: mockColumnsB
  }

  it("should return the correct columns when a valid selector key is found", () => {
    const config = {
      columnSelectorKey: "reportCategory",
      columns: dynamicColumns
    } as unknown as NestedGroupedReportConfig<any, any, any>

    const table = { reportCategory: "TypeA", data: [] }

    const result = getMappedColumns(config, table)

    expect(result).toEqual(mockColumnsA)
  })

  it("should return an empty array if the selector value does not exist in the columns mapping", () => {
    const config = {
      columnSelectorKey: "reportCategory",
      columns: dynamicColumns
    } as unknown as NestedGroupedReportConfig<any, any, any>

    const table = { reportCategory: "NonExistentType" }

    const result = getMappedColumns(config, table)

    expect(result).toEqual([])
  })

  it("should return an empty array if columnSelectorKey is missing in the config", () => {
    const config = {
      columns: dynamicColumns
    } as unknown as NestedGroupedReportConfig<any, any, any>

    const table = { reportCategory: "TypeA" }

    const result = getMappedColumns(config, table)

    expect(result).toEqual([])
  })

  it("should return an empty array if columns is not an object", () => {
    const config = {
      columnSelectorKey: "category",
      columns: null
    } as unknown as NestedGroupedReportConfig<any, any, any>

    const table = { category: "TypeA" }

    const result = getMappedColumns(config, table)

    expect(result).toEqual([])
  })

  it("should return an empty array if the selector key points to a non-existent property in table", () => {
    const config = {
      columnSelectorKey: "missingKey",
      columns: dynamicColumns
    } as unknown as NestedGroupedReportConfig<any, any, any>

    const table = { someOtherKey: "TypeA" }

    const result = getMappedColumns(config, table)

    expect(result).toEqual([])
  })
})
