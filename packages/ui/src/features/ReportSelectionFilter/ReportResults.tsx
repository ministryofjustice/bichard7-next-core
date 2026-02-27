import { REPORT_TYPE_MAP, ReportType } from "types/reports/ReportType"
import { ReportConfig } from "types/reports/Config"
import { Loading } from "components/Loading"
import { ReportTable } from "./ReportTable"

interface ReportResultsProps {
  isStreaming: boolean
  hasRun: boolean
  reportType: ReportType | undefined
  rows: Record<string, unknown>[]
  config: ReportConfig | null
}

export const ReportResults: React.FC<ReportResultsProps> = ({ isStreaming, hasRun, reportType, rows, config }) => {
  if (!reportType) {
    return null
  }

  const reportName = REPORT_TYPE_MAP[reportType]

  const hasFinishedRunning = hasRun && !isStreaming
  const hasRows = rows.length > 0

  return (
    <div className="results-area" aria-busy={isStreaming} aria-live="polite">
      {isStreaming && <Loading text={`Loading ${reportName} report...`} />}

      {hasFinishedRunning &&
        (hasRows && config ? (
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
