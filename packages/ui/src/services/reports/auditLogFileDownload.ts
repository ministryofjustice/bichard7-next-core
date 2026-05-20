import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { auditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import Permission from "@moj-bichard7/common/types/Permission"
import {
  AUTOMATED_REPORT_TYPE_MAP,
  type AutomatedReportType
} from "@moj-bichard7/common/types/reports/AutomatedReportType"
import { REPORT_TYPE_MAP, type ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { AUDIT_LOG_EVENT_SOURCE } from "config"
import { format, isValid, parse } from "date-fns"
import type User from "services/entities/User"
import { storeUserAuditLogEvents } from "services/storeAuditLogEvents"

export interface LogQuery {
  csvDownload: string
  xlsxDownload: string
  reportType: ReportType | AutomatedReportType
  fromDate: string
  toDate: string
}

export const auditLogFileDownload = async (currentUser: User, query: LogQuery): PromiseResult<void> => {
  if (!userAccess(currentUser)[Permission.ViewReports]) {
    return new Error("403")
  }

  const { csvDownload, xlsxDownload, reportType, fromDate, toDate } = query

  if (csvDownload !== "true" && xlsxDownload !== "true") {
    return new Error("400")
  }

  if (csvDownload === "true" && xlsxDownload === "true") {
    return new Error("400")
  }

  const hasDates = fromDate && toDate
  let formattedFromDate
  let formattedToDate

  if (hasDates) {
    const parsedFromDate = parse(fromDate, "yyyy-MM-dd", new Date())
    const parsedToDate = parse(toDate, "yyyy-MM-dd", new Date())

    if (!isValid(parsedFromDate) || !isValid(parsedToDate)) {
      return new Error("400")
    }

    formattedFromDate = format(parsedFromDate, "yyyy-MM-dd")
    formattedToDate = format(parsedToDate, "yyyy-MM-dd")
  }

  const isCsvDownload = csvDownload === "true"
  const includeDateRangeProperty = hasDates && isCsvDownload

  let reportId

  if (AUTOMATED_REPORT_TYPE_MAP[reportType as AutomatedReportType]) {
    reportId = AUTOMATED_REPORT_TYPE_MAP[reportType as AutomatedReportType]
  }

  if (REPORT_TYPE_MAP[reportType as ReportType]) {
    reportId = REPORT_TYPE_MAP[reportType as ReportType]
  }

  const event = {
    attributes: {
      auditLogVersion: 2,
      ...(includeDateRangeProperty && { "Date Range": `${formattedFromDate} to ${formattedToDate}` }),
      "Output Format": `Download as ${isCsvDownload ? "CSV" : "XLSX"}`,
      "Report ID": reportId
    },
    category: EventCategory.information,
    eventCode: EventCode.ReportRun,
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: auditLogEventLookup[EventCode.ReportRun],
    timestamp: new Date(),
    user: currentUser.username
  } satisfies AuditLogEvent

  return await storeUserAuditLogEvents(currentUser.username, [event]).catch((err) => err)
}
