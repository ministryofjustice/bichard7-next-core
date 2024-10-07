export enum CaseDetailsReportType {
  Exceptions = "Exceptions",
  Triggers = "Triggers",
  ExceptionsAndTriggers = "ExceptionsAndTriggers"
}

export type ReportDateRange = {
  from: Date
  to: Date
}

export type ReportQueryParams = {
  reportDateRange?: ReportDateRange
  caseDetailsReportType?: CaseDetailsReportType
}
