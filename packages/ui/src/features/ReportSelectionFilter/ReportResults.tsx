import { REPORT_TYPE_MAP, ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { Loading } from "components/Loading"
import { ReportConfig } from "types/reports/Config"
import { ReportTable } from "./ReportTable"

interface ReportResultsProps {
  isStreaming: boolean
  reportType: ReportType | undefined
  rows: Record<string, unknown>[] | null
  config: ReportConfig | null
}

export const ReportResults: React.FC<ReportResultsProps> = ({ isStreaming, reportType, rows, config }) => {
  if (!reportType) {
    return null
  }

  const reportName = REPORT_TYPE_MAP[reportType]

  return (
    <div className="results-area" aria-busy={isStreaming} aria-live="polite">
      {isStreaming && <Loading text={`Loading ${reportName} report...`} />}

      {!isStreaming &&
        !!rows &&
        (rows.length > 0 && config ? (
          <section aria-label={`${reportName} results loaded`} tabIndex={-1}>
            <ReportTable config={config} rows={rows} tableName={`${reportName} report`} />
          </section>
        ) : (
          <div className="govuk-!-text-align-centre" style={{ marginTop: "2rem" }}>
            <p className="govuk-body">
              <output>{"No results found for the selected criteria."}</output>
            </p>
          </div>
        ))}
    </div>
  )
}
