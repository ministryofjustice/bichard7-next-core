import type User from "services/entities/User"
import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { REPORT_TYPE_MAP, type ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { AUDIT_LOG_EVENT_SOURCE } from "config"
import { auditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"
import { storeUserAuditLogEvents } from "services/storeAuditLogEvents"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import { format, isValid, parse } from "date-fns"

export interface LogQuery {
  csvDownload: string
  reportType: ReportType
  fromDate: string
  toDate: string
}

export const auditLogCsvDownload = async (currentUser: User, query: LogQuery): PromiseResult<void> => {
  if (!userAccess(currentUser)[Permission.ViewReports]) {
    return new Error("403")
  }

  const { csvDownload, reportType, fromDate, toDate } = query

  if (csvDownload !== "true") {
    return new Error("400")
  }

  const parsedFromDate = parse(fromDate, "yyyy-MM-dd", new Date())
  const parsedToDate = parse(toDate, "yyyy-MM-dd", new Date())

  if (!isValid(parsedFromDate) || !isValid(parsedToDate)) {
    return new Error("400")
  }

  const formattedFromDate = format(parsedFromDate, "yyyy-MM-dd")
  const formattedToDate = format(parsedToDate, "yyyy-MM-dd")

  const event = {
    attributes: {
      auditLogVersion: 2,
      "Date Range": `${formattedFromDate} to ${formattedToDate}`,
      "Output Format": "Download as CSV",
      "Report ID": REPORT_TYPE_MAP[reportType]
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
