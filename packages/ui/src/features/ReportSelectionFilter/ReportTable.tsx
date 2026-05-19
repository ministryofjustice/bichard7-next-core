import { NestedTable } from "@/components/Reports/NestedTable"
import { GroupTable } from "components/Reports/GroupTable"
import { SimpleTable } from "components/Reports/SimpleTable"
import { FlatReportConfig, GroupedReportConfig, NestedGroupedReportConfig } from "types/reports/Config"
import { StyledReportTable } from "./ReportTable.styles"

export type ReportTableProps<
  TOuterGroup extends Record<string, unknown> = Record<string, unknown>,
  TInnerGroup extends Record<string, unknown> = Record<string, unknown>,
  TRow extends Record<string, unknown> = Record<string, unknown>
> = {
  tableName: string
  nested?: boolean
} & (
  | { config: FlatReportConfig<TRow>; rows: TRow[] }
  | { config: GroupedReportConfig<TOuterGroup, TRow>; rows: TOuterGroup[] }
  | { config: NestedGroupedReportConfig<TOuterGroup, TInnerGroup, TRow>; rows: TOuterGroup[] }
)

export const ReportTable = <
  TOuterGroup extends Record<string, unknown> = Record<string, unknown>,
  TInnerGroup extends Record<string, unknown> = Record<string, unknown>,
  TRow extends Record<string, unknown> = Record<string, unknown>
>({
  config,
  tableName,
  rows,
  nested = false
}: ReportTableProps<TOuterGroup, TInnerGroup, TRow>) => {
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
      table = <GroupTable config={config} groups={rows as TOuterGroup[]} />
      break
    case "nested":
      table = <NestedTable config={config} groups={rows as TOuterGroup[]} />
      break
  }

  return <StyledReportTable>{table}</StyledReportTable>
}
