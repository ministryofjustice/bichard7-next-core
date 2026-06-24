import { FormGroup } from "@/components/FormGroup"
import ResolveByFilter from "@/components/SearchFilters/ResolvedByFilter"
import { createReportCsv } from "@/services/reports/csvGeneration/createReportCsv"
import { xlsxFilename } from "@/services/reports/utils/xlsxFilename"
import AuditResolvedBy from "@/types/AuditResolvedBy"
import { validateResolvedBy } from "@/utils/reports/validateResolvedBy"
import { AUTOMATED_REPORT_TYPE_MAP, AutomatedReportType } from "@moj-bichard7/common/types/reports/AutomatedReportType"
import { REPORT_TYPE_MAP, ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { Card } from "components/Card"
import { SyntheticEvent, useEffect, useReducer, useState } from "react"
import { downloadReport } from "services/reports/downloadReport"
import { csvFilename } from "services/reports/utils/csvFilename"
import { ReportConfig } from "types/reports/Config"
import { ReportConfigs } from "types/reports/ReportConfigs"
import bundleReportData from "utils/reports/bundleReportData"
import { validateCheckboxes } from "utils/reports/validateCheckboxes"
import { validateDateRange } from "utils/reports/validateDateRange"
import { validateSelectReport } from "utils/reports/validateSelectReport"
import { ActionBar } from "./ActionBar"
import { Checkboxes } from "./Checkboxes"
import { DateRange } from "./DateRange"
import { ReportResults } from "./ReportResults"
import { ReportSelectionFilterWrapper } from "./ReportSelectionFilter.styles"
import { SelectReportDropdown } from "./SelectReportDropdown"
import { filterReducer, initialFilterState } from "./reducers/filters"

export const ReportSelectionFilter: React.FC<{ resolvedBy: AuditResolvedBy[] }> = (props) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null)
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string | null>(null)
  const [reportFilename, setReportFilename] = useState<string>("")

  const [filterValues, dispatch] = useReducer(filterReducer, initialFilterState)

  const config = filterValues.reportType
    ? (ReportConfigs[filterValues.reportType as keyof typeof ReportConfigs] as unknown as ReportConfig)
    : null

  const reportData = bundleReportData(config, rows)

  const handleSetDateFrom = (date: string) => {
    dispatch({ type: "SET_DATE_FROM", payload: date })
  }

  const handleSetDateTo = (date: string) => {
    dispatch({ type: "SET_DATE_TO", payload: date })
  }

  const handleSelectChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    const selectedValue = event.currentTarget.value

    if (AUTOMATED_REPORT_TYPE_MAP[selectedValue as AutomatedReportType]) {
      dispatch({ type: "SET_AUTOMATED_REPORT_TYPE", payload: selectedValue as AutomatedReportType })
    }
    if (REPORT_TYPE_MAP[selectedValue as ReportType]) {
      dispatch({ type: "SET_REPORT_TYPE", payload: selectedValue as ReportType })
    }
  }

  const handleCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    const { id, checked } = event.currentTarget
    dispatch({ type: "SET_CHECKBOX", payload: { id, checked } })
  }

  const handleResolvedByChange = (selectedUsers: string[]) => {
    dispatch({ type: "SET_RESOLVED_BY", payload: selectedUsers })
  }

  const clearFilters = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setRows(null)
    setFileDownloadUrl(null)
    dispatch({ type: "RESET_FILTERS" })
  }

  const clearResults = () => {
    setRows(null)
    setFileDownloadUrl(null)
  }

  const validateFilters = (): boolean => {
    const rangeValidation = validateDateRange(filterValues.dateFrom, filterValues.dateTo)
    const checkboxesValidation = validateCheckboxes(
      filterValues.reportType as ReportType,
      filterValues.triggers,
      filterValues.exceptions
    )
    const selectReportValidation = validateSelectReport(filterValues.reportType as ReportType)

    const resolvedByValidation = validateResolvedBy(filterValues.resolvedBy)

    const newErrors = {
      dateFromError: rangeValidation.fromError,
      dateToError: rangeValidation.toError,
      reportTypeError: selectReportValidation,
      checkboxesError: checkboxesValidation,
      resolvedByError: resolvedByValidation
    }

    dispatch({ type: "SET_ERRORS", payload: newErrors })

    if (Object.values(newErrors).some((error) => error !== null) || !config) {
      return false
    } else {
      return true
    }
  }

  const handleAutomatedReportDownload = async () => {
    if (filterValues.reportType) {
      const filename = xlsxFilename(filterValues.reportType as AutomatedReportType)
      setReportFilename(filename)
      setFileDownloadUrl(`/reports/${filename}`)
    }
  }

  const handleDownload = async () => {
    try {
      const reportType = filterValues.reportType as ReportType
      const urlQuery = new URLSearchParams({
        fromDate: filterValues.dateFrom,
        toDate: filterValues.dateTo,
        exceptions: String(filterValues.exceptions),
        triggers: String(filterValues.triggers),
        resolvedBy: String(filterValues.resolvedBy)
      })

      const parsedData = await downloadReport(reportType, urlQuery)

      const reportData = bundleReportData(config, parsedData)

      if (reportData) {
        const csvBlob = await createReportCsv(reportData, reportType, filterValues.dateFrom, filterValues.dateTo)
        setFileDownloadUrl(globalThis.URL.createObjectURL(csvBlob))
        setReportFilename(csvFilename(reportType, urlQuery))
      }
      setRows(parsedData)
    } catch (error) {
      console.error("Fetch failed:", error)
    } finally {
      setIsStreaming(false)
    }
  }

  const handleRunReport = async () => {
    if (!validateFilters()) {
      return
    }

    setIsStreaming(true)
    setRows([])
    setFileDownloadUrl(null)

    await handleDownload()
  }

  useEffect(() => {
    return () => {
      if (fileDownloadUrl) {
        globalThis.URL.revokeObjectURL(fileDownloadUrl)
      }
    }
  }, [fileDownloadUrl])

  useEffect(() => {
    clearResults()
  }, [filterValues])

  useEffect(() => {
    if (filterValues.reportType && filterValues.isAutomatedReport) {
      handleAutomatedReportDownload()
    }
  }, [filterValues.reportType, filterValues.isAutomatedReport])

  return (
    <>
      <ReportSelectionFilterWrapper aria-busy={isStreaming}>
        <Card heading={"Reports"} isContentVisible={true}>
          <fieldset className="govuk-fieldset fields-wrapper">
            <div id={"report-section"} className="reports-section-wrapper">
              <SelectReportDropdown
                handleChange={handleSelectChange}
                reportType={filterValues.reportType}
                error={filterValues.reportTypeError}
              />
            </div>

            <div id={"date-range-section"} className="date-range-section-wrapper">
              {filterValues.reportType && !filterValues.isAutomatedReport && (
                <DateRange
                  dateFromString={filterValues.dateFrom}
                  dateToString={filterValues.dateTo}
                  setDateFromString={handleSetDateFrom}
                  setDateToString={handleSetDateTo}
                  dateFromError={filterValues.dateFromError}
                  dateToError={filterValues.dateToError}
                />
              )}
            </div>
            <div id={"include-section"} className="include-section-wrapper">
              {filterValues.reportType === "exceptions" && (
                <Checkboxes
                  handleChange={handleCheckbox}
                  triggers={filterValues.triggers}
                  exceptions={filterValues.exceptions}
                  error={filterValues.checkboxesError}
                />
              )}
            </div>
            <div id={"resolved-by-section"} className="resolved-by-section-wrapper">
              {filterValues.reportType === "exceptions" && (
                <>
                  <h2 className="govuk-heading-m">{"Resolved by"}</h2>
                  <FormGroup showError={!!filterValues.resolvedByError}>
                    {filterValues.resolvedByError && (
                      <p className="govuk-error-message">
                        <span className="govuk-visually-hidden">{"Error:"}</span>
                        {filterValues.resolvedByError}
                      </p>
                    )}
                    <ResolveByFilter
                      resolvers={props.resolvedBy}
                      resolvedBy={filterValues.resolvedBy}
                      onChange={handleResolvedByChange}
                    />
                  </FormGroup>
                </>
              )}
            </div>
          </fieldset>
          <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
          <ActionBar
            clearFilters={clearFilters}
            handleRunReport={handleRunReport}
            fileDownloadUrl={fileDownloadUrl}
            reportFilename={reportFilename}
            hasRows={!!rows && rows.length > 0}
            reportOptions={{
              isAutomatedReport: filterValues.isAutomatedReport,
              reportType: filterValues.reportType,
              fromDate: filterValues.dateFrom,
              toDate: filterValues.dateTo
            }}
          />
        </Card>
      </ReportSelectionFilterWrapper>

      <ReportResults
        reportType={filterValues.reportType as ReportType}
        reportData={reportData}
        isStreaming={isStreaming}
      />
    </>
  )
}
