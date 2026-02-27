import { LinkButton } from "components/Buttons/LinkButton"
import { Button } from "components/Buttons/Button"
import { SyntheticEvent } from "react"
import { LinkStyleButton, StyledActionBar } from "./ActionBar.styles"

interface ActionBarProps {
  csvDownloadUrl: string | null
  hasRows: boolean
  csvReportFilename: string | null
  handleDownload: () => void
  clearFilters: (event: SyntheticEvent<HTMLButtonElement>) => void
}

export const ActionBar: React.FC<ActionBarProps> = ({
  csvDownloadUrl,
  csvReportFilename,
  hasRows,
  handleDownload,
  clearFilters
}) => {
  return (
    <StyledActionBar role="toolbar" aria-label="Report actions">
      {csvDownloadUrl && hasRows ? (
        <LinkButton
          href={csvDownloadUrl}
          download={csvReportFilename}
          overrideLink={true}
          className={"left-aligned"}
          aria-label={`Download report as CSV: ${csvReportFilename}`}
        >
          {"Download CSV"}
        </LinkButton>
      ) : null}

      <Button
        id={"run-report"}
        className="run-report-button"
        onClick={handleDownload}
        aria-label="Run report based on selected filters"
      >
        {"Run Report"}
      </Button>

      <LinkStyleButton type="button" onClick={clearFilters}>
        {"Clear filters"}
      </LinkStyleButton>
    </StyledActionBar>
  )
}
