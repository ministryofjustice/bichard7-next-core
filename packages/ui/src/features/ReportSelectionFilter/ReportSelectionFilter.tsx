import { Card } from "components/Card"
import Checkbox from "components/Checkbox/Checkbox"
import { FormGroup } from "components/FormGroup"
import { Select } from "components/Select"
import { SyntheticEvent, useEffect, useRef, useState } from "react"
import { createReportCsv } from "services/reports/createReportCsv"
import { downloadReport } from "services/reports/downloadReport"
import { csvFilename } from "services/reports/utils/csvFilename"
import { ReportConfigs } from "types/reports/Config"
import { REPORT_TYPE_MAP, ReportType } from "types/reports/ReportType"
import { ActionBar } from "./ActionBar"
import { DateRange, DateRangeRef } from "./DateRange"
import { ReportResults } from "./ReportResults"
import { ReportSelectionFilterWrapper } from "./ReportSelectionFilter.styles"

const FIELD_REQUIRED_ERROR = "This field is required"
const AT_LEAST_ONE_CHECKBOX_REQUIRED = "At least one option must be selected"

export const ReportSelectionFilter: React.FC = () => {
  const dateRangeRef = useRef<DateRangeRef>(null)

  const [filterValues, setFilterValues] = useState({
    reportType: undefined as ReportType | undefined,
    dateTo: "",
    dateFrom: "",
    exceptions: true,
    triggers: true
  })

  const handleSetDateFrom = (date: string): void => {
    setFilterValues((prev) => ({ ...prev, dateFrom: date }))
  }

  const handleSetDateTo = (date: string): void => {
    setFilterValues((prev) => ({ ...prev, dateTo: date }))
  }

  const [hasRun, setHasRun] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [csvDownloadUrl, setCsvDownloadUrl] = useState<string | null>(null)
  const [csvReportFilename, setCsvReportFilename] = useState<string>("")

  const [showSelectError, setShowSelectError] = useState<boolean>(false)
  const [showCheckboxesError, setShowCheckboxesError] = useState<boolean>(false)

  useEffect(() => {
    if (!filterValues.exceptions && !filterValues.triggers) {
      setShowCheckboxesError(true)
    } else {
      setShowCheckboxesError(false)
    }
  }, [filterValues.exceptions, filterValues.triggers])

  const config = filterValues.reportType ? ReportConfigs[filterValues.reportType] : null

  const handleSelectChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    console.log(event)
    setFilterValues((prev) => ({
      ...prev,
      reportType: event.currentTarget.value as ReportType,
      triggers: true,
      exceptions: true
    }))

    setShowSelectError(false)
    setRows([])
    setCsvDownloadUrl(null)
    setHasRun(false)
  }

  const handleCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const target = event.currentTarget

    setFilterValues((prev) => ({
      ...prev,
      [target.id]: target.checked
    }))

    setHasRun(false)
  }

  const handleDownload = async () => {
    if (!filterValues.reportType || !config) {
      setShowSelectError(true)
    }

    const isDateRangeValid = dateRangeRef.current?.validateRange()

    if (!filterValues.reportType || !config || !isDateRangeValid || showCheckboxesError) {
      return
    }

    setIsStreaming(true)
    setHasRun(true)
    setRows([])
    setCsvDownloadUrl(null)

    try {
      const urlQuery = new URLSearchParams({
        fromDate: filterValues.dateFrom,
        toDate: filterValues.dateTo,
        exceptions: String(filterValues.exceptions),
        triggers: String(filterValues.triggers)
      })

      const parsedData = await downloadReport(filterValues.reportType, urlQuery)
      const csvBlob = await createReportCsv(
        parsedData,
        config,
        filterValues.reportType,
        filterValues.dateFrom,
        filterValues.dateTo
      )

      setRows(parsedData)
      setCsvDownloadUrl(globalThis.URL.createObjectURL(csvBlob))
      setCsvReportFilename(csvFilename(filterValues.reportType, urlQuery))
    } catch (error) {
      console.error("Fetch failed:", error)
    } finally {
      setIsStreaming(false)
    }
  }

  const clearFilters = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setRows([])
    setCsvDownloadUrl(null)
    setHasRun(false)

    setFilterValues({
      reportType: undefined,
      dateTo: "",
      dateFrom: "",
      exceptions: true,
      triggers: true
    })
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
                  value={filterValues.reportType || ""}
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
                setDateFromString={handleSetDateFrom}
                setDateToString={handleSetDateTo}
                setHasRun={setHasRun}
                dateFromString={filterValues.dateFrom}
                dateToString={filterValues.dateTo}
                ref={dateRangeRef}
              />
            </div>
            <div id={"include-section"} className="include-section-wrapper">
              {filterValues.reportType === "exceptions" && (
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
                      <Checkbox
                        label={"Triggers"}
                        checked={filterValues.triggers}
                        id={"triggers"}
                        onChange={handleCheckbox}
                      />
                      <Checkbox
                        label={"Exceptions"}
                        checked={filterValues.exceptions}
                        id={"exceptions"}
                        onChange={handleCheckbox}
                      />
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

      <ReportResults
        reportType={filterValues.reportType}
        rows={rows}
        config={config}
        hasRun={hasRun}
        isStreaming={isStreaming}
      />
    </>
  )
}
