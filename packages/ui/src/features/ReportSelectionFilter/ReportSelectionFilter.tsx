import { FormGroup } from "@/components/FormGroup"
import ResolveByFilter from "@/components/SearchFilters/ResolvedByFilter"
import SelectAllCheckboxesFilter from "@/components/SearchFilters/SelectAllCheckboxesFilter"
import { createReportCsv } from "@/services/reports/csvGeneration/createReportCsv"
import { xlsxFilename } from "@/services/reports/utils/xlsxFilename"
import AuditResolvedBy from "@/types/AuditResolvedBy"
import { validateResolvedBy } from "@/utils/reports/validateResolvedBy"
import { validateResultCodeCheckboxes } from "@/utils/reports/validateResultCodeCheckboxes"
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
import { filterReducer, initialFilterState } from "./reducers/filters"
import { ReportResults } from "./ReportResults"
import { ReportSelectionFilterWrapper } from "./ReportSelectionFilter.styles"
import { SelectReportDropdown } from "./SelectReportDropdown"

const RESULT_CODES_LIST = [
  { id: "1032", label: "Community order amended" },
  { id: "1116", label: "Community order" },
  { id: "1030", label: "Community order varied" },
  { id: "4575", label: "Warrant for arrest for breach of community penalty with bail (dated)" },
  { id: "4577", label: "Warrant for arrest for community penalty breach with bail (undated)" },
  { id: "4576", label: "Warrant for arrest for community penalty breach without bail" },
  { id: "1507", label: "Suspended sentence of imprisonment implemented" },
  { id: "1508", label: "Suspended sentence order amended - imprisonment" },
  { id: "1115", label: "Suspended sentence order - imprisonment" },
  { id: "1134", label: "Suspended sentence order - detention" }
]

export const ReportSelectionFilter: React.FC<{
  resolvedBy?: AuditResolvedBy[]
  canUseTriggerAndExceptionQualityAuditing?: boolean
}> = ({ resolvedBy = [], canUseTriggerAndExceptionQualityAuditing = false }) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null)
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string | null>(null)
  const [reportFilename, setReportFilename] = useState<string>("")

  const [filterValues, dispatch] = useReducer(filterReducer, {
    ...initialFilterState,
    canUseTriggerAndExceptionQualityAuditing: canUseTriggerAndExceptionQualityAuditing
  })

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

  const handleResultCodesChange = (selectedResultCodes: string[]) => {
    dispatch({ type: "SET_RESULT_CODES", payload: selectedResultCodes })
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

    const resolvedByValidation = validateResolvedBy(
      filterValues.reportType as ReportType,
      filterValues.resolvedBy,
      canUseTriggerAndExceptionQualityAuditing
    )

    const resultCodesError = validateResultCodeCheckboxes(
      filterValues.reportType as ReportType,
      filterValues.resultCodes
    )

    const newErrors = {
      dateFromError: rangeValidation.fromError,
      dateToError: rangeValidation.toError,
      reportTypeError: selectReportValidation,
      checkboxesError: checkboxesValidation,
      resolvedByError: resolvedByValidation,
      resultCodesError: resultCodesError
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

      const allResolversSelected = resolvedBy.every((r) => filterValues.resolvedBy.includes(r.username))

      const urlQuery = new URLSearchParams({
        fromDate: filterValues.dateFrom,
        toDate: filterValues.dateTo,
        exceptions: String(filterValues.exceptions),
        triggers: String(filterValues.triggers)
      })

      if (!allResolversSelected) {
        for (const user of filterValues.resolvedBy) {
          urlQuery.append("resolvedBy", user)
        }
      }

      if (reportType === "community sentence") {
        for (const resultCode of filterValues.resultCodes) {
          urlQuery.append("resultCodes", resultCode)
        }
      }

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
              {filterValues.reportType === "community sentence" && (
                <>
                  <h2 className="govuk-heading-m">{"Result codes"}</h2>
                  <FormGroup showError={!!filterValues.resultCodesError}>
                    {filterValues.resultCodesError && (
                      <p className="govuk-error-message">
                        <span className="govuk-visually-hidden">{"Error:"}</span>
                        {filterValues.resultCodesError}
                      </p>
                    )}
                    <SelectAllCheckboxesFilter
                      onChange={handleResultCodesChange}
                      allCheckboxLabel="result codes"
                      allOptions={RESULT_CODES_LIST}
                      selected={filterValues.resultCodes}
                    />
                  </FormGroup>
                </>
              )}
            </div>
            {filterValues.reportType === "exceptions" && canUseTriggerAndExceptionQualityAuditing && (
              <div id={"resolved-by-section"} className="resolved-by-section-wrapper">
                <h2 className="govuk-heading-m">{"Resolved by"}</h2>
                <FormGroup showError={!!filterValues.resolvedByError}>
                  {filterValues.resolvedByError && (
                    <p className="govuk-error-message">
                      <span className="govuk-visually-hidden">{"Error:"}</span>
                      {filterValues.resolvedByError}
                    </p>
                  )}
                  <ResolveByFilter
                    resolvers={resolvedBy}
                    resolvedBy={filterValues.resolvedBy}
                    onChange={handleResolvedByChange}
                  />
                </FormGroup>
              </div>
            )}
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
