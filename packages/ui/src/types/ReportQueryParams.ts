export enum CaseDetailsReportType {
  Exceptions = "Exceptions",
  ExceptionsAndTriggers = "ExceptionsAndTriggers",
  Triggers = "Triggers"
}

export type ReportDateRange = {
  from: Date
  to: Date
}

export type ReportQueryParams = {
  caseDetailsReportType?: CaseDetailsReportType
  reportDateRange?: ReportDateRange
}
