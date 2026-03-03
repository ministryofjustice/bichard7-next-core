import { Card } from "components/Card"
import Checkbox from "components/Checkbox/Checkbox"
import DateInput from "components/CustomDateInput/DateInput"
import { FormGroup } from "components/FormGroup"
import { Select } from "components/Select"
import { NextPage } from "next"
import { SyntheticEvent, useEffect, useState } from "react"
import { createReportCsv } from "services/reports/createReportCsv"
import { downloadReport } from "services/reports/downloadReport"
import { csvFilename } from "services/reports/utils/csvFilename"
import { ReportConfigs } from "types/reports/Config"
import { REPORT_TYPE_MAP, ReportType } from "types/reports/ReportType"
import { ActionBar } from "./ActionBar"
import { ReportResults } from "./ReportResults"
import { ReportSelectionFilterWrapper } from "./ReportSelectionFilter.styles"

const getDaysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(0, 0, 0, 0)
  return date
}

const FIELD_REQUIRED_ERROR = "This field is required"

export const ReportSelectionFilter: NextPage = () => {
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

  const [minDate] = useState<Date>(getDaysAgo(31))
  const [today] = useState<Date>(new Date())

  const [showSelectError, setShowSelectError] = useState<boolean>(false)
  const [showDateFromError, setShowDateFromError] = useState<boolean>(false)
  const [showDateToError, setShowDateToError] = useState<boolean>(false)
  const [dateFromErrorMessage, setDateFromErrorMessage] = useState<string>("")
  const [dateToErrorMessage, setDateToErrorMessage] = useState<string>("")

  const config = reportType ? ReportConfigs[reportType] : null

  const handleSelectChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    setReportType(event.currentTarget.value as ReportType)
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

    const dateFrom = new Date(dateFromString)
    const dateTo = new Date(dateToString)

    if (dateFromString === "") {
      setShowDateFromError(true)
      setDateFromErrorMessage(FIELD_REQUIRED_ERROR)
    } else {
      if (dateFrom < minDate) {
        setShowDateFromError(true)
        setDateFromErrorMessage("Date must not be further in the past than 31 days ago")
      } else if (dateFrom > today) {
        setShowDateFromError(true)
        setDateFromErrorMessage("Date cannot be in the future")
      } else if (dateToString !== "" && dateFrom > dateTo) {
        setShowDateFromError(true)
        setDateFromErrorMessage("Date cannot be after 'Date to'")
      }
    }

    if (dateToString === "") {
      setShowDateToError(true)
      setDateToErrorMessage(FIELD_REQUIRED_ERROR)
    } else {
      if (dateTo > today) {
        setShowDateToError(true)
        setDateToErrorMessage("Date cannot be in the future")
      } else if (dateTo < minDate) {
        setShowDateToError(true)
        setDateToErrorMessage("Date must not be further in the past than 31 days ago")
      } else if (dateFromString !== "" && dateTo < dateFrom) {
        setShowDateToError(true)
        setDateToErrorMessage("Date cannot be before 'Date from'")
      }
    }

    if (!reportType || !config || dateFromString === "" || dateToString === "") {
      return
    }

    setIsStreaming(true)
    setHasRun(true)
    setRows([])
    setCsvDownloadUrl(null)

    try {
      const urlQuery = new URLSearchParams({
        dateFromString,
        dateToString,
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
                  {"Select Report"}
                </label>
                {showSelectError ? (
                  <p className="govuk-error-message">
                    <span className="govuk-visually-hidden">{"Error:"}</span> {FIELD_REQUIRED_ERROR}
                  </p>
                ) : null}
                <Select
                  id={"report-select"}
                  placeholder={"Select Report..."}
                  name={"select-case-type"}
                  className="select-report-input"
                  onChange={handleSelectChange}
                  aria-describedby="report-type-label"
                  value={reportType || ""}
                  showError={showSelectError}
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
              </FormGroup>
            </div>
            <div id={"date-range-section"} className="date-range-section-wrapper">
              <h2 className={"govuk-heading-m"}>{"Date range"}</h2>
              <div className="calendars-wrapper">
                <div id={"report-selection-date-from"} className="date">
                  <DateInput
                    dateType="resolvedFrom"
                    dispatch={(p) => {
                      setDateFromString(p.value as string)
                      setShowDateFromError(false)
                      setHasRun(false)
                    }}
                    value={dateFromString}
                    dateRange={undefined}
                    minValue={minDate}
                    maxValue={dateToString === "" ? today : new Date(dateToString)}
                    showError={showDateFromError}
                    errorMessage={dateFromErrorMessage}
                  />
                </div>
                <div id={"report-selection-date-to"} className="date">
                  <DateInput
                    dateType="resolvedTo"
                    dispatch={(p) => {
                      setDateToString(p.value as string)
                      setShowDateToError(false)
                      setHasRun(false)
                    }}
                    value={dateToString}
                    dateRange={undefined}
                    minValue={dateFromString === "" ? minDate : new Date(dateFromString)}
                    maxValue={today}
                    showError={showDateToError}
                    errorMessage={dateToErrorMessage}
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
