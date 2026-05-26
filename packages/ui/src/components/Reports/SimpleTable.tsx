import { calculateTotalsForFlatStructure } from "@/utils/reports/calculateTotalsForFlatStructure"
import { REPORT_TYPE_MAP } from "@moj-bichard7/common/types/reports/ReportType"
import { ReportTableHeader } from "components/Reports/ReportTableHeader"
import { Table } from "components/Table"
import { FlatReportConfig } from "types/reports/Config"
import { ReportTableBody } from "./ReportTableBody"
import { Totals } from "./Totals"

interface SimpleTableProps<T> {
  config: FlatReportConfig<T>
  rows: T[]
  tableName: string
  nested: boolean
}

export const SimpleTable = <T extends Record<string, unknown>>({
  config,
  rows,
  tableName,
  nested
}: SimpleTableProps<T>) => {
  if (config.structure !== "flat") {
    return null
  }

  const totals = calculateTotalsForFlatStructure(rows, config.totalsConfig, config.calculateTotalsCallback)

  return (
    <section aria-label={`${tableName} container`} data-testid="simple-table">
      {nested ? null : (
        <div>
          <div className="govuk-body">
            <strong>
              {REPORT_TYPE_MAP[config.reportType]} {"report"}
            </strong>

            <Totals totals={totals} totalsConfig={config.totalsConfig ?? []} />
          </div>
        </div>
      )}

      <Table>
        <caption className={"govuk-visually-hidden"}>{tableName}</caption>

        <ReportTableHeader columns={config.columns} />
        <ReportTableBody rows={rows} columns={config.columns} />
      </Table>
    </section>
  )
}
