import { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { Card } from "components/Card"
import { SyntheticEvent, useEffect, useState } from "react"
import { createReportCsv } from "services/reports/createReportCsv"
import { downloadReport } from "services/reports/downloadReport"
import { csvFilename } from "services/reports/utils/csvFilename"
import { ReportConfig, ReportConfigs } from "types/reports/Config"
import { ActionBar } from "./ActionBar"
import { Checkboxes } from "./Checkboxes"
import { DateRange } from "./DateRange"
import { ReportResults } from "./ReportResults"
import { ReportSelectionFilterWrapper } from "./ReportSelectionFilter.styles"
import { SelectReportDropdown } from "./SelectReportDropdown"
import {
  DATE_CANNOT_BE_AFTER_DATE_TO,
  DATE_CANNOT_BE_BEFORE_DATE_FROM,
  validateCheckboxes,
  validateDateRange,
  validateSelectReport
} from "./validation"

export const ReportSelectionFilter: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null)
  const [csvDownloadUrl, setCsvDownloadUrl] = useState<string | null>(null)
  const [csvReportFilename, setCsvReportFilename] = useState<string>("")

  const [filterValues, setFilterValues] = useState({
    reportType: undefined as ReportType | undefined,
    dateTo: "",
    dateFrom: "",
    exceptions: true,
    triggers: true
  })
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const clearParallelError = (field: string) => {
    if (errors[field] === DATE_CANNOT_BE_BEFORE_DATE_FROM) {
      setErrors((prev) => ({ ...prev, ["dateFrom"]: null }))
    }
    if (errors[field] === DATE_CANNOT_BE_AFTER_DATE_TO) {
      setErrors((prev) => ({ ...prev, ["dateTo"]: null }))
    }
  }

  const clearErrors = (field: string) => {
    if (errors[field]) {
      clearParallelError(field)
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const config = filterValues.reportType ? ReportConfigs[filterValues.reportType] : null

  const handleSetDateFrom = (date: string) => {
    setFilterValues((prev) => ({
      ...prev,
      dateFrom: date
    }))
    clearErrors("dateFrom")
  }

  const handleSetDateTo = (date: string) => {
    setFilterValues((prev) => ({
      ...prev,
      dateTo: date
    }))
    clearErrors("dateTo")
  }

  const handleSelectChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    const reportType = event.currentTarget.value as ReportType
    setFilterValues((prev) => ({
      ...prev,
      reportType: reportType,
      triggers: true,
      exceptions: true
    }))
    setErrors({})
  }

  const handleCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const { id, checked } = event.currentTarget

    setFilterValues((prev) => {
      const next = { ...prev, [id]: checked }
      const checkboxesValidation = validateCheckboxes(next.reportType, next.triggers, next.exceptions)

      setErrors((errs) => ({ ...errs, checkboxes: checkboxesValidation }))
      return next
    })
  }

  const clearResults = () => {
    setRows(null)
    setCsvDownloadUrl(null)
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

  const validateFilters = (): boolean => {
    const rangeValidation = validateDateRange(filterValues.dateFrom, filterValues.dateTo)
    const checkboxesValidation = validateCheckboxes(
      filterValues.reportType,
      filterValues.triggers,
      filterValues.exceptions
    )
    const selectReportValidation = validateSelectReport(filterValues.reportType)

    const newErrors = {
      dateFrom: rangeValidation.fromError,
      dateTo: rangeValidation.toError,
      reportType: selectReportValidation,
      checkboxes: checkboxesValidation
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some((error) => error !== null) || !config) {
      return false
    } else {
      return true
    }
  }

  const handleDownload = async () => {
    try {
      const reportType = filterValues.reportType as ReportType
      const urlQuery = new URLSearchParams({
        fromDate: filterValues.dateFrom,
        toDate: filterValues.dateTo,
        exceptions: String(filterValues.exceptions),
        triggers: String(filterValues.triggers)
      })

      const parsedData = await downloadReport(reportType, urlQuery)
      const csvBlob = await createReportCsv(
        parsedData,
        config as ReportConfig,
        reportType,
        filterValues.dateFrom,
        filterValues.dateTo
      )

      setRows(parsedData)
      setCsvDownloadUrl(globalThis.URL.createObjectURL(csvBlob))
      setCsvReportFilename(csvFilename(reportType, urlQuery))
    } catch (error) {
      console.error("Fetch failed:", error)
    } finally {
      setIsStreaming(false)
    }
  }

  const handleRunReport = () => {
    if (!validateFilters()) {
      return
    }

    setIsStreaming(true)
    setRows([])
    setCsvDownloadUrl(null)

    handleDownload()
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
                error={errors.reportType}
              />
            </div>
            <div id={"date-range-section"} className="date-range-section-wrapper">
              <DateRange
                dateFromString={filterValues.dateFrom}
                dateToString={filterValues.dateTo}
                setDateFromString={handleSetDateFrom}
                setDateToString={handleSetDateTo}
                dateFromError={errors.dateFrom}
                dateToError={errors.dateTo}
              />
            </div>
            <div id={"include-section"} className="include-section-wrapper">
              {filterValues.reportType === "exceptions" && (
                <Checkboxes
                  handleChange={handleCheckbox}
                  triggers={filterValues.triggers}
                  exceptions={filterValues.exceptions}
                  error={errors.checkboxes}
                />
              )}
            </div>
          </fieldset>
          <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
          <ActionBar
            clearFilters={clearFilters}
            csvDownloadUrl={csvDownloadUrl}
            handleRunReport={handleRunReport}
            csvReportFilename={csvReportFilename}
            hasRows={!!rows && rows.length > 0}
            reportOptions={{
              reportType: filterValues.reportType,
              fromDate: filterValues.dateFrom,
              toDate: filterValues.dateTo
            }}
          />
        </Card>
      </ReportSelectionFilterWrapper>

      <ReportResults reportType={filterValues.reportType} rows={rows} config={config} isStreaming={isStreaming} />
    </>
  )
}
