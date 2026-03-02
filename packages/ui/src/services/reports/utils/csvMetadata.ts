import { format, parse } from "date-fns"
import type { ReportType } from "types/reports/ReportType"
import { REPORT_TYPE_MAP } from "types/reports/ReportType"
import { escapeCsvCell } from "./escapeCsvCell"

export const csvMetadata = (reportType: ReportType, fromDate: string | null, toDate: string | null): string => {
  if (!fromDate || !toDate) {
    throw new Error("Invalid date")
  }

  const dateFormat = "dd/MM/yyyy"

  const formattedFromDate = format(parse(fromDate, "yyyy-MM-dd", new Date()), dateFormat)
  const formattedToDate = format(parse(toDate, "yyyy-MM-dd", new Date()), dateFormat)
  const formattedReportRun = format(new Date(), `${dateFormat} HH:mm:ss`)

  const prettyReportType = REPORT_TYPE_MAP[reportType]

  return `${escapeCsvCell(prettyReportType)},Date run: ${formattedReportRun},From: ${formattedFromDate},To: ${formattedToDate}`
}
