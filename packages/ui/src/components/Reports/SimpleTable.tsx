import React from "react"
import { ReportConfig } from "types/reports/Config"
import { ReportTableHeader } from "components/Reports/ReportTableHeader"
import { ReportTableBody } from "./ReportTableBody"
import { Table } from "components/Table"

interface SimpleTableProps<T> {
  config: ReportConfig
  rows: T[]
  tableName: string
}

export const SimpleTable = <T extends Record<string, unknown>>({ config, rows, tableName }: SimpleTableProps<T>) => {
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
