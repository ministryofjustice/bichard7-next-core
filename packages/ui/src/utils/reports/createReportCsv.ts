import { json2csv } from "json-2-csv"
import { ReportType } from "utils/reports/ReportTypes"
import type { Report } from "utils/reports/Report"

const config: Record<string, object> = {
  [ReportType.RESOLVED_EXCEPTIONS]: {
    keys: [
      { field: "ASN" },
      { field: "PTIURN" },
      { field: "defendantName", title: "Defendant Name" },
      { field: "courtName", title: "Court Name" },
      { field: "hearingDate", title: "Hearing Date" },
      { field: "caseReference", title: "Case Reference" },
      { field: "dateTimeRecievedByCJSE", title: "Date/Time Received By CJSE" },
      { field: "dateTimeResolved", title: "Date/Time Resolved" },
      { field: "notes", title: "Notes" },
      { field: "resolutionAction", title: "Resolution Action" }
    ]
  },
  [ReportType.CASE_LIST]: {
    keys: [
      { field: "defendantName", title: "Defendant Name" },
      { field: "courtDate", title: "Court Date" },
      { field: "courtName", title: "Court Name" },
      { field: "PTIURN" },
      { field: "notes", title: "Notes" },
      { field: "reason", title: "Reason" },
      { field: "errorsLockedBy", title: "Errors Locked By" },
      { field: "triggersLockedBy", title: "Triggers Locked By" }
    ]
  }
}

export function createReportCsv<T extends object>(report: Report<T>, reportType: ReportType): string {
  return json2csv(report.report, config[reportType])
}
