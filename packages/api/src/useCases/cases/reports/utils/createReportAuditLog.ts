import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { REPORT_TYPE_MAP } from "@moj-bichard7/common/types/reports/ReportType"
import { isError } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"

import buildAuditLogUserEvent from "../../../auditLog/buildAuditLogUserEvent"
import createAuditLogUserEvent from "../../../createAuditLogUserEvents"
import { formatDate } from "./formatDate"

export type CreateReportAuditLogOptions = {
  auditLogGateway: AuditLogDynamoGateway
  duration: number
  fromDate?: Date
  reportType: ReportType
  toDate?: Date
  totalRecords: number
  user: User
}

export const createReportAuditLog = async (options: CreateReportAuditLogOptions): PromiseResult<void> => {
  const { auditLogGateway, duration, fromDate, reportType, toDate, totalRecords, user } = options

  const eventDetails: Record<string, number | string> = {
    auditLogVersion: 2,
    "Date Range": `${formatDate(fromDate)} to ${formatDate(toDate)}`,
    "Number of Records Returned": totalRecords,
    "Output Format": "Viewed in UI",
    "Report ID": REPORT_TYPE_MAP[reportType],
    "Time Taken": `${duration}ms`
  }

  const reportAuditLogEvent = buildAuditLogUserEvent(
    user.username,
    EventCode.ReportRun,
    EventCategory.information,
    "Bichard New UI",
    eventDetails
  )

  const result = await createAuditLogUserEvent([reportAuditLogEvent], auditLogGateway)

  if (isError(result)) {
    console.error("Failed to save audit log", result)
    return result
  }
}
