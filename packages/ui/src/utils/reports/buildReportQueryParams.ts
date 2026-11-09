import type AuditResolvedBy from "@/types/AuditResolvedBy"
import type { FilterState } from "@/types/reports/ReportSelectionFilter"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { TRPR0031_RESULTS } from "@moj-bichard7/common/utils/triggerConstants"

export const buildReportQueryParams = (filterValues: FilterState, allResolvers: AuditResolvedBy[]): URLSearchParams => {
  const query = new URLSearchParams({
    fromDate: filterValues.dateFrom,
    toDate: filterValues.dateTo
  })

  switch (filterValues.reportType as ReportType) {
    case "exceptions": {
      query.set("exceptions", String(filterValues.exceptions))
      query.set("triggers", String(filterValues.triggers))

      const allSelected =
        allResolvers.length > 0 && allResolvers.every((r) => filterValues.resolvedBy.includes(r.username))

      if (!allSelected) {
        filterValues.resolvedBy.forEach((user) => query.append("resolvedBy", user))
      }

      break
    }

    case "community sentence": {
      const allSelected = TRPR0031_RESULTS.every((option) => filterValues.resultCodes.includes(option.id))

      if (!allSelected) {
        filterValues.resultCodes.forEach((code) => query.append("resultCodes", code))
      }

      break
    }

    default:
      break
  }

  return query
}
