import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"

export type FilterState = {
  reportType: ReportType | undefined
  dateTo: string
  dateFrom: string
  exceptions: boolean
  triggers: boolean
}

export type FilterAction =
  | { type: "SET_REPORT_TYPE"; payload: ReportType }
  | { type: "SET_DATE_FROM"; payload: string }
  | { type: "SET_DATE_TO"; payload: string }
  | { type: "SET_CHECKBOX"; payload: { id: string; checked: boolean } }
  | { type: "RESET_FILTERS" }
