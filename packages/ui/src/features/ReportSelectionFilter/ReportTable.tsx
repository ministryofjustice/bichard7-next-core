import { NestedTable } from "@/components/Reports/NestedTable"
import { GroupTable } from "components/Reports/GroupTable"
import { SimpleTable } from "components/Reports/SimpleTable"
import { FlatReportConfig, GroupedReportConfig, NestedGroupedReportConfig } from "types/reports/Config"
import { StyledReportTable } from "./ReportTable.styles"

export type ReportTableProps<
  TGroup extends Record<string, unknown> = Record<string, unknown>,
  TTable extends Record<string, unknown> = Record<string, unknown>,
  TRow extends Record<string, unknown> = Record<string, unknown>
> = {
  tableName: string
  nested?: boolean
} & (
  | { config: FlatReportConfig<TRow>; rows: TRow[] }
  | { config: GroupedReportConfig<TTable, TRow>; rows: TTable[] }
  | { config: NestedGroupedReportConfig<TGroup, TTable, TRow>; rows: TGroup[] }
)

export const ReportTable = <
  TGroup extends Record<string, unknown> = Record<string, unknown>,
  TTable extends Record<string, unknown> = Record<string, unknown>,
  TRow extends Record<string, unknown> = Record<string, unknown>
>({
  config,
  tableName,
  rows,
  nested = false
}: ReportTableProps<TGroup, TTable, TRow>) => {
  if (!config) {
    return null
  }

  if (rows.length === 0) {
    return null
  }

  let table = null

  switch (config.structure) {
    case "flat":
      table = <SimpleTable config={config} rows={rows as TRow[]} tableName={tableName} nested={nested} />
      break
    case "grouped":
      table = <GroupTable config={config} tables={rows as TTable[]} />
      break
    case "nested":
      table = <NestedTable config={config} groups={rows as TGroup[]} />
      break
  }

  return <StyledReportTable>{table}</StyledReportTable>
}
