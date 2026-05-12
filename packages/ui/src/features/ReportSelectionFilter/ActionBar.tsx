import { AutomatedReportType } from "@moj-bichard7/common/types/reports/AutomatedReportType"
import { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { Button } from "components/Buttons/Button"
import { LinkButton } from "components/Buttons/LinkButton"
import { SyntheticEvent } from "react"
import { LinkStyleButton, StyledActionBar } from "./ActionBar.styles"

interface ReportOptions {
  isAutomatedReport?: boolean
  reportType?: ReportType | AutomatedReportType
  fromDate: string
  toDate: string
}

interface ActionBarProps {
  fileDownloadUrl: string | null
  reportFilename: string | null
  hasRows: boolean
  handleRunReport: () => void
  clearFilters: (event: SyntheticEvent<HTMLButtonElement>) => void
  reportOptions: ReportOptions
}

export const ActionBar: React.FC<ActionBarProps> = ({
  fileDownloadUrl,
  reportFilename,
  hasRows,
  handleRunReport,
  clearFilters,
  reportOptions
}) => {
  const isStandardReport = !!reportOptions.reportType && !reportOptions.isAutomatedReport
  const showStandardReportDownload = fileDownloadUrl && hasRows && isStandardReport
  const showAutomatedReportDownload = fileDownloadUrl && !!reportOptions.reportType && reportOptions.isAutomatedReport

  const onFileDownload = async (fileType: "CSV" | "XLSX") => {
    if (!reportOptions.reportType) {
      console.log("Report type not found.")
      return
    }

    let query = new URLSearchParams()

    if (fileType === "CSV") {
      query = new URLSearchParams({
        csvDownload: "true",
        reportType: reportOptions.reportType,
        fromDate: reportOptions.fromDate,
        toDate: reportOptions.toDate
      })
    }

    if (fileType === "XLSX") {
      query = new URLSearchParams({
        xlsxDownload: "true",
        reportType: reportOptions.reportType
      })
    }

    const response = await fetch(`/bichard/api/reports/log?${query}`)

    if (!response.ok) {
      console.error(`Failed to Log ${fileType} Download`)
    }
  }

  return (
    <StyledActionBar role="group" aria-label="Report actions">
      {showStandardReportDownload ? (
        <LinkButton
          href={fileDownloadUrl}
          download={reportFilename}
          overrideLink={true}
          className={"left-aligned"}
          aria-label={`Download report as CSV: ${reportFilename}`}
          aria-live="polite"
          onClick={() => onFileDownload("CSV")}
        >
          {"Download CSV"}
        </LinkButton>
      ) : null}

      {showAutomatedReportDownload ? (
        <LinkButton
          id={"download-automated-report"}
          href={fileDownloadUrl}
          download={reportFilename}
          overrideLink={true}
          className={"left-aligned"}
          aria-label={`Download report as XLSX: ${reportFilename}`}
          aria-live="polite"
          onClick={() => onFileDownload("XLSX")}
        >
          {"Download report"}
        </LinkButton>
      ) : null}

      {isStandardReport && (
        <Button id={"run-report"} className="run-report-button" onClick={handleRunReport} aria-live="polite">
          {"Run report"}
        </Button>
      )}

      <LinkStyleButton id={"clear-filters"} type="button" onClick={clearFilters}>
        {"Clear filters"}
      </LinkStyleButton>
    </StyledActionBar>
  )
}
