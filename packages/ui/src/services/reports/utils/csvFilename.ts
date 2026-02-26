import type { ReportType } from "types/reports/ReportType"
import { REPORT_TYPE_MAP } from "types/reports/ReportType"
import { format } from "date-fns"

export const csvFilename = (reportType: ReportType, urlQuery: URLSearchParams) => {
  const fromDate = urlQuery.get("fromDate")
  const toDate = urlQuery.get("toDate")

  if (!fromDate || !toDate) {
    throw new Error("No valid dates")
  }

  const formattedType = REPORT_TYPE_MAP[reportType].toLowerCase().replaceAll(" ", "-")
  const formattedToDate = format(toDate, "dd-MM-yyyy")
  const formattedFromDate = format(fromDate, "dd-MM-yyyy")

  return `report-${formattedType}-${formattedFromDate}-to-${formattedToDate}.csv`
}
