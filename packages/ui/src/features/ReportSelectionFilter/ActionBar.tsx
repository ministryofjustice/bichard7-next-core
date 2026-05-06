import { AutomatedReportType } from "@moj-bichard7/common/types/reports/AutomatedReportType"
import { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { Button } from "components/Buttons/Button"
import { LinkButton } from "components/Buttons/LinkButton"
import { SyntheticEvent } from "react"
import { LinkStyleButton, StyledActionBar } from "./ActionBar.styles"

interface ReportOptions {
  reportType?: ReportType
  automatedReportType?: AutomatedReportType
  fromDate: string
  toDate: string
}

interface ActionBarProps {
  csvDownloadUrl: string | null
  automatedReportFilename: string | null
  hasRows: boolean
  csvReportFilename: string | null
  handleRunReport: () => void
  clearFilters: (event: SyntheticEvent<HTMLButtonElement>) => void
  reportOptions: ReportOptions
}

export const ActionBar: React.FC<ActionBarProps> = ({
  csvDownloadUrl,
  automatedReportFilename,
  csvReportFilename,
  hasRows,
  handleRunReport,
  clearFilters,
  reportOptions
}) => {
  const isAutomatedReport = !!reportOptions.automatedReportType
  const isStandardReport = !!reportOptions.reportType
  const showStandardReportDownload = csvDownloadUrl && hasRows && isStandardReport

  const onCsvDownload = async () => {
    if (!reportOptions.reportType) {
      console.log("Report type not found.")
      return
    }

    const query = new URLSearchParams({
      csvDownload: "true",
      reportType: reportOptions.reportType,
      fromDate: reportOptions.fromDate,
      toDate: reportOptions.toDate
    })
    const response = await fetch(`/bichard/api/reports/log?${query}`)

    if (!response.ok) {
      console.error("Failed to Log CSV Download")
    }
  }

  return (
    <StyledActionBar role="group" aria-label="Report actions">
      {showStandardReportDownload ? (
        <LinkButton
          href={csvDownloadUrl}
          download={csvReportFilename}
          overrideLink={true}
          className={"left-aligned"}
          aria-label={`Download report as CSV: ${csvReportFilename}`}
          aria-live="polite"
          onClick={onCsvDownload}
        >
          {"Download CSV"}
        </LinkButton>
      ) : null}

      {isAutomatedReport ? (
        <LinkButton
          id={"download-automated-report"}
          href={`/reports/${automatedReportFilename}`}
          download={automatedReportFilename}
          overrideLink={true}
          className={"left-aligned"}
          aria-label={`Download report as XLSX: ${automatedReportFilename}`}
          aria-live="polite"
        >
          {"Download report"}
        </LinkButton>
      ) : null}

      {isStandardReport ? (
        <Button id={"run-report"} className="run-report-button" onClick={handleRunReport} aria-live="polite">
          {"Run report"}
        </Button>
      ) : null}

      <LinkStyleButton id={"clear-filters"} type="button" onClick={clearFilters}>
        {"Clear filters"}
      </LinkStyleButton>
    </StyledActionBar>
  )
}
