import { Card } from "components/Card"
import Checkbox from "components/Checkbox/Checkbox"
import DateInput from "components/CustomDateInput/DateInput"
import { Select } from "components/Select"
import {
  ReportSelectionFilterWrapper,
  ResultsTableWrapper
} from "features/ReportSelectionFilter/ReportSelectionFilter.styles"
import { NextPage } from "next"
import { Button } from "../../components/Buttons/Button"
import { REPORT_TYPE_MAP, ReportType } from "types/reports/ReportType"
import { SyntheticEvent, useState, useEffect } from "react"
import { downloadReport } from "services/reports/downloadReport"
import { createReportCsv } from "services/reports/createReportCsv"
import { Loading } from "components/Loading"
import { GroupTable } from "components/Reports/GroupTable"
import { SimpleTable } from "components/Reports/SimpleTable"
import { ReportConfigs } from "types/reports/Config"
import { csvFilename } from "services/reports/utils/csvFilename"
import { LinkButton } from "components/Buttons/LinkButton"

export const ReportSelectionFilter: NextPage = () => {
  const [reportType, setReportType] = useState<ReportType | undefined>(undefined)
  const [toDate, setToDate] = useState<string>("")
  const [fromDate, setFromDate] = useState<string>("")
  const [exceptions, setExceptions] = useState<boolean>(true)
  const [triggers, setTriggers] = useState<boolean>(true)

  const [isStreaming, setIsStreaming] = useState(false)
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [csvDownloadUrl, setCsvDownloadUrl] = useState<string | null>(null)
  const [csvReportFilename, setCsvReportFilename] = useState<string>("")

  const config = reportType ? ReportConfigs[reportType] : null

  const handleChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    setReportType(event.currentTarget.value as ReportType)
    setRows([])
    setCsvDownloadUrl(null)
  }

  const handleCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const target = event.currentTarget

    if (target.id === "exceptions") {
      setExceptions(target.checked)
    }

    if (target.id === "triggers") {
      setTriggers(target.checked)
    }
  }

  const handleDownload = async () => {
    if (!reportType || !config) {
      return
    }

    setIsStreaming(true)
    setRows([])
    setCsvDownloadUrl(null)

    try {
      const urlQuery = new URLSearchParams({
        fromDate,
        toDate,
        exceptions: String(exceptions),
        triggers: String(triggers)
      })

      const parsedData = await downloadReport(reportType, urlQuery)
      const csvBlob = await createReportCsv(parsedData, config, reportType, fromDate, toDate)

      setRows(parsedData)
      setCsvDownloadUrl(globalThis.URL.createObjectURL(csvBlob))
      setCsvReportFilename(csvFilename(reportType, urlQuery))
    } catch (error) {
      console.error("Fetch failed:", error)
    } finally {
      setIsStreaming(false)
    }
  }

  const clearFilters = (event: SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    setReportType(undefined)
    setRows([])
    setCsvDownloadUrl(null)

    setToDate("")
    setFromDate("")
    setTriggers(true)
    setExceptions(true)
  }

  useEffect(() => {
    return () => {
      if (csvDownloadUrl) {
        globalThis.URL.revokeObjectURL(csvDownloadUrl)
      }
    }
  }, [csvDownloadUrl])

  return (
    <>
      <ReportSelectionFilterWrapper>
        <Card heading={"Search reports"} isContentVisible={true}>
          <fieldset className="govuk-fieldset fields-wrapper">
            <div id={"report-section"} className="reports-section-wrapper">
              <h2 className={"govuk-heading-m"}>{"Reports"}</h2>
              <label className="govuk-body" htmlFor={"report-select"}>
                {"Sort by"}
              </label>
              <Select
                id={"report-select"}
                placeholder={"Select Report..."}
                name={"select-case-type"}
                className="select-report-input"
                onChange={handleChange}
                value={reportType || ""}
              >
                <option disabled={true} value={""}>
                  {"Select Report..."}
                </option>
                {Object.entries(REPORT_TYPE_MAP).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </div>
            <div id={"date-range-section"} className="date-range-section-wrapper">
              <h2 className={"govuk-heading-m"}>{"Date range"}</h2>
              <div className="calendars-wrapper">
                <div id={"report-selection-date-from"} className="date">
                  <DateInput
                    dateType="resolvedFrom"
                    dispatch={(p) => setFromDate(p.value as string)}
                    value={fromDate}
                    dateRange={undefined}
                  />
                </div>
                <div id={"report-selection-date-to"} className="date">
                  <DateInput
                    dateType="resolvedTo"
                    dispatch={(p) => setToDate(p.value as string)}
                    value={toDate}
                    dateRange={undefined}
                  />
                </div>
              </div>
            </div>
            <div id={"include-section"} className="include-section-wrapper">
              <h2 className={"govuk-heading-m"}>{"Include"}</h2>
              <label className="govuk-body" htmlFor={"checkboxes-container"}>
                {"Select an option"}
              </label>
              <div id={"checkboxes-container"} className="checkboxes-wrapper">
                <Checkbox label={"Triggers"} checked={triggers} id={"triggers"} onChange={handleCheckbox} />
                <Checkbox label={"Exceptions"} checked={exceptions} id={"exceptions"} onChange={handleCheckbox} />
              </div>
            </div>
          </fieldset>
          <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
          <div className="bottom-actions-bar">
            {csvDownloadUrl && rows.length > 0 ? (
              <LinkButton
                href={csvDownloadUrl}
                download={csvReportFilename}
                overrideLink={true}
                className={"left-aligned"}
              >
                {"Download CSV"}
              </LinkButton>
            ) : null}
            <Button id={"run-report"} className="run-report-button" onClick={handleDownload}>
              {"Run Report"}
            </Button>
            <a
              className="govuk-link govuk-link--no-visited-state"
              href="/bichard/report-selection"
              onClick={clearFilters}
            >
              {"Clear filters"}
            </a>
          </div>
        </Card>
      </ReportSelectionFilterWrapper>

      <ResultsTableWrapper>
        {isStreaming && reportType ? <Loading text={`Loading ${REPORT_TYPE_MAP[reportType]} report...`} /> : undefined}

        {rows.length > 0 && config && (
          <div className={"reports-table"}>
            {config.isGrouped ? (
              <GroupTable config={config} groups={rows} />
            ) : (
              <SimpleTable config={config} rows={rows} />
            )}
          </div>
        )}
      </ResultsTableWrapper>
    </>
  )
}
