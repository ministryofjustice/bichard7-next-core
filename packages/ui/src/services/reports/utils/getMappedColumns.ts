import type { BaseReportColumn, ReportColumn } from "@/types/reports/Columns"
import type { NestedGroupedReportConfig } from "@/types/reports/Config"

export const getMappedColumns = <TGroup, TTable, TRow>(
  config: NestedGroupedReportConfig<TGroup, TTable, TRow>,
  table: Record<string, unknown>
): BaseReportColumn[] => {
  const cols = config.columns

  if (config.columnSelectorKey && typeof cols === "object") {
    const selectorValue = String(table[config.columnSelectorKey as string])

    try {
      const dynamicCols = (cols as Record<string, ReportColumn<unknown>[]>)[selectorValue]
      return dynamicCols || []
    } catch {
      return []
    }
  }

  return []
}
