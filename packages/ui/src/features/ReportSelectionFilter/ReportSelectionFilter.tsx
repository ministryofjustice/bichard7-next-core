import { Card } from "components/Card"
import { SyntheticEvent, useEffect, useRef, useState } from "react"
import { createReportCsv } from "services/reports/createReportCsv"
import { downloadReport } from "services/reports/downloadReport"
import { csvFilename } from "services/reports/utils/csvFilename"
import { ReportConfigs } from "types/reports/Config"
import { ReportType } from "types/reports/ReportType"
import { ActionBar } from "./ActionBar"
import { Checkboxes, CheckboxesRef } from "./Checkboxes"
import { DateRange, DateRangeRef } from "./DateRange"
import { ReportResults } from "./ReportResults"
import { ReportSelectionFilterWrapper } from "./ReportSelectionFilter.styles"
import { SelectReportDropdown, SelectReportDropdownRef } from "./SelectReportDropdown"

export const ReportSelectionFilter: React.FC = () => {
  const dateRangeRef = useRef<DateRangeRef>(null)
  const checkboxesRef = useRef<CheckboxesRef>(null)
  const selectReportDropdownRef = useRef<SelectReportDropdownRef>(null)

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

  const config = filterValues.reportType ? ReportConfigs[filterValues.reportType] : null

  const clearResults = () => {
    setRows([])
    setCsvDownloadUrl(null)
    setHasRun(false)
  }

  const handleSelectChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    const reportType = event.currentTarget.value as ReportType
    setFilterValues((prev) => ({
      ...prev,
      reportType: reportType,
      triggers: true,
      exceptions: true
    }))

    clearResults()
  }

  const handleCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const target = event.currentTarget

    setFilterValues((prev) => ({
      ...prev,
      [target.id]: target.checked
    }))
  }

  const handleDownload = async () => {
    const isSelectValid = selectReportDropdownRef.current?.validate()
    const isDateRangeValid = dateRangeRef.current?.validateRange()

    if (!config || !isDateRangeValid || !isSelectValid) {
      return
    }

    const areCheckboxesValid = checkboxesRef.current?.validate()

    if (filterValues.reportType === "exceptions" && !areCheckboxesValid) {
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

    clearResults()

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

  useEffect(() => {
    clearResults()
  }, [filterValues])

  return (
    <>
      <ReportSelectionFilterWrapper aria-busy={isStreaming}>
        <Card heading={"Reports"} isContentVisible={true}>
          <fieldset className="govuk-fieldset fields-wrapper">
            <div id={"report-section"} className="reports-section-wrapper">
              <SelectReportDropdown
                handleChange={handleSelectChange}
                reportType={filterValues.reportType}
                ref={selectReportDropdownRef}
              />
            </div>
            <div id={"date-range-section"} className="date-range-section-wrapper">
              <DateRange
                setDateFromString={handleSetDateFrom}
                setDateToString={handleSetDateTo}
                dateFromString={filterValues.dateFrom}
                dateToString={filterValues.dateTo}
                ref={dateRangeRef}
              />
            </div>
            <div id={"include-section"} className="include-section-wrapper">
              {filterValues.reportType === "exceptions" && (
                <Checkboxes
                  handleChange={handleCheckbox}
                  triggers={filterValues.triggers}
                  exceptions={filterValues.exceptions}
                  ref={checkboxesRef}
                />
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
