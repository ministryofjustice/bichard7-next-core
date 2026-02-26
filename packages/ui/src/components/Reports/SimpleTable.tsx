import React from "react"
import { ReportConfig } from "types/reports/Config"
import { ReportTableHeader } from "components/Reports/ReportTableHeader"
import { ReportTableBody } from "./ReportTableBody"
import { Table } from "components/Table"

interface SimpleTableProps<T> {
  config: ReportConfig
  rows: T[]
}

export const SimpleTable = <T extends Record<string, unknown>>({ config, rows }: SimpleTableProps<T>) => {
  return (
    <Table style={{ width: "100%", borderCollapse: "collapse" }}>
      <ReportTableHeader columns={config.columns} />
      <ReportTableBody rows={rows} columns={config.columns} />
    </Table>
  )
}
