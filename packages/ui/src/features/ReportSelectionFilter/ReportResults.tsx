import { REPORT_TYPE_MAP, ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { Loading } from "components/Loading"
import { ReportData } from "types/reports/Config"
import { ReportTable } from "./ReportTable"
import { StickyBackToTop } from "@/components/Buttons/StickyBackToTop"

interface ReportResultsProps {
  isStreaming: boolean
  reportType: ReportType | undefined
  reportData: ReportData | null
}

export const ReportResults: React.FC<ReportResultsProps> = ({ isStreaming, reportType, reportData }) => {
  if (!reportType) {
    return null
  }

  const reportName = REPORT_TYPE_MAP[reportType]
  const reportHasRun = !isStreaming && reportData !== null

  return (
    <div className="results-area" aria-busy={isStreaming} aria-live="polite">
      {isStreaming && <Loading text={`Loading ${reportName} report...`} />}

      {reportHasRun &&
        (reportData.rows.length > 0 ? (
          <section aria-label={`${reportName} results loaded`} tabIndex={-1}>
            <ReportTable {...reportData} tableName={`${reportName} report`} />
            <StickyBackToTop />
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
