import type { BaseReportColumn, ReportColumn } from "@/types/reports/Columns"
import type { NestedGroupedReportConfig } from "@/types/reports/Config"

export const getMappedColumns = <TOuter, TInner, TRow>(
  config: NestedGroupedReportConfig<TOuter, TInner, TRow>,
  innerGroup: Record<string, unknown>
): BaseReportColumn[] => {
  const cols = config.columns

  if (config.columnSelectorKey && typeof cols === "object") {
    const selectorValue = String(innerGroup[config.columnSelectorKey as string])

    try {
      const dynamicCols = (cols as Record<string, ReportColumn<unknown>[]>)[selectorValue]
      return dynamicCols || []
    } catch {
      return []
    }
  }

  return []
}
