import { ReportTableHeader } from "components/Reports/ReportTableHeader"
import { Table } from "components/Table"
import { ReportConfig } from "types/reports/Config"
import { ReportTableBody } from "./ReportTableBody"

interface SimpleTableProps<T> {
  config: ReportConfig
  rows: T[]
  tableName: string
}

export const SimpleTable = <T extends Record<string, unknown>>({ config, rows, tableName }: SimpleTableProps<T>) => {
  if (config.structure !== "flat") {
    return null
  }

  return (
    <section aria-label={`${tableName} container`}>
      <Table>
        <caption className={"govuk-visually-hidden"}>{tableName}</caption>

        <ReportTableHeader columns={config.columns} />
        <ReportTableBody rows={rows} columns={config.columns} />
      </Table>
    </section>
  )
}
