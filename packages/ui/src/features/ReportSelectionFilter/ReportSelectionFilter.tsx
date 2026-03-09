import { Card } from "components/Card"
import Checkbox from "components/Checkbox/Checkbox"
import { FormGroup } from "components/FormGroup"
import { Select } from "components/Select"
import { ReportSelectionFilterWrapper } from "./ReportSelectionFilter.styles"
import { REPORT_TYPE_MAP, ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { downloadReport } from "services/reports/downloadReport"
import { SyntheticEvent, useEffect, useRef, useState } from "react"
import { createReportCsv } from "services/reports/createReportCsv"
import { csvFilename } from "services/reports/utils/csvFilename"
import { ReportConfigs } from "types/reports/Config"
import { ActionBar } from "./ActionBar"
import { DateRange, DateRangeRef } from "./DateRange"
import { ReportResults } from "./ReportResults"

const FIELD_REQUIRED_ERROR = "This field is required"
const AT_LEAST_ONE_CHECKBOX_REQUIRED = "At least one option must be selected"

export const ReportSelectionFilter: React.FC = () => {
  const dateRangeRef = useRef<DateRangeRef>(null)

  const [reportType, setReportType] = useState<ReportType | undefined>(undefined)
  const [dateToString, setDateToString] = useState<string>("")
  const [dateFromString, setDateFromString] = useState<string>("")
  const [exceptions, setExceptions] = useState<boolean>(true)
  const [triggers, setTriggers] = useState<boolean>(true)

  const [hasRun, setHasRun] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [csvDownloadUrl, setCsvDownloadUrl] = useState<string | null>(null)
  const [csvReportFilename, setCsvReportFilename] = useState<string>("")

  const [showSelectError, setShowSelectError] = useState<boolean>(false)
  const [showCheckboxesError, setShowCheckboxesError] = useState<boolean>(false)

  useEffect(() => {
    if (!exceptions && !triggers) {
      setShowCheckboxesError(true)
    } else {
      setShowCheckboxesError(false)
    }
  }, [exceptions, triggers])

  const config = reportType ? ReportConfigs[reportType] : null

  const handleSelectChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    setReportType(event.currentTarget.value as ReportType)
    setTriggers(true)
    setExceptions(true)
    setShowSelectError(false)
    setRows([])
    setCsvDownloadUrl(null)
    setHasRun(false)
  }

  const handleCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const target = event.currentTarget

    if (target.id === "exceptions") {
      setExceptions(target.checked)
    }

    if (target.id === "triggers") {
      setTriggers(target.checked)
    }

    setHasRun(false)
  }

  const handleDownload = async () => {
    if (!reportType || !config) {
      setShowSelectError(true)
    }

    const isDateRangeValid = dateRangeRef.current?.validateRange()

    if (!reportType || !config || !isDateRangeValid || showCheckboxesError) {
      return
    }

    setIsStreaming(true)
    setHasRun(true)
    setRows([])
    setCsvDownloadUrl(null)

    try {
      const urlQuery = new URLSearchParams({
        fromDate: dateFromString,
        toDate: dateToString,
        exceptions: String(exceptions),
        triggers: String(triggers)
      })

      const parsedData = await downloadReport(reportType, urlQuery)
      const csvBlob = await createReportCsv(parsedData, config, reportType, dateFromString, dateToString)

      setRows(parsedData)
      setCsvDownloadUrl(globalThis.URL.createObjectURL(csvBlob))
      setCsvReportFilename(csvFilename(reportType, urlQuery))
    } catch (error) {
      console.error("Fetch failed:", error)
    } finally {
      setIsStreaming(false)
    }
  }

  const clearFilters = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setReportType(undefined)
    setRows([])
    setCsvDownloadUrl(null)
    setHasRun(false)

    setDateToString("")
    setDateFromString("")
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
      <ReportSelectionFilterWrapper aria-busy={isStreaming}>
        <Card heading={"Reports"} isContentVisible={true}>
          <fieldset className="govuk-fieldset fields-wrapper">
            <div id={"report-section"} className="reports-section-wrapper">
              <h2 className={"govuk-heading-m"}>{"Reports"}</h2>
              <FormGroup showError={showSelectError}>
                <label className="govuk-body" htmlFor={"report-select"}>
                  {"Select report"}
                </label>
                {showSelectError ? (
                  <p className="govuk-error-message">
                    <span className="govuk-visually-hidden">{"Error:"}</span> {FIELD_REQUIRED_ERROR}
                  </p>
                ) : null}
                <Select
                  id={"report-select"}
                  placeholder={"Select report..."}
                  name={"select-case-type"}
                  className="select-report-input"
                  onChange={handleSelectChange}
                  aria-describedby="report-type-label"
                  value={reportType || ""}
                  showError={showSelectError}
                >
                  <option disabled={true} value={""}>
                    {"Select report..."}
                  </option>
                  {Object.entries(REPORT_TYPE_MAP).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </div>
            <div id={"date-range-section"} className="date-range-section-wrapper">
              <DateRange
                setDateFromString={setDateFromString}
                setDateToString={setDateToString}
                setHasRun={setHasRun}
                dateFromString={dateFromString}
                dateToString={dateToString}
                ref={dateRangeRef}
              />
            </div>
            <div id={"include-section"} className="include-section-wrapper">
              {reportType === "exceptions" && (
                <>
                  <h2 className={"govuk-heading-m"}>{"Include"}</h2>
                  <FormGroup showError={showCheckboxesError}>
                    <label className="govuk-body" htmlFor={"checkboxes-container"}>
                      {"Select an option"}
                    </label>
                    {showCheckboxesError ? (
                      <p className="govuk-error-message">
                        <span className="govuk-visually-hidden">{"Error:"}</span> {AT_LEAST_ONE_CHECKBOX_REQUIRED}
                      </p>
                    ) : null}
                    <div id={"checkboxes-container"} className="checkboxes-wrapper">
                      <Checkbox label={"Triggers"} checked={triggers} id={"triggers"} onChange={handleCheckbox} />
                      <Checkbox label={"Exceptions"} checked={exceptions} id={"exceptions"} onChange={handleCheckbox} />
                    </div>
                  </FormGroup>
                </>
              )}
            </div>
          </fieldset>
          <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
          <ActionBar
            clearFilters={clearFilters}
            csvDownloadUrl={csvDownloadUrl}
            handleDownload={handleDownload}
            csvReportFilename={csvReportFilename}
            hasRows={rows.length > 0}
          />
        </Card>
      </ReportSelectionFilterWrapper>

      <ReportResults reportType={reportType} rows={rows} config={config} hasRun={hasRun} isStreaming={isStreaming} />
    </>
  )
}
