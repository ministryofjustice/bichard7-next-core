import type { CaseState, Reason } from "./CaseListQueryParams"

export type FilterAction =
  | { method: FilterMethod; type: "defendantName"; value: string }
  | { method: FilterMethod; type: "courtName"; value: string }
  | { method: FilterMethod; type: "reasonCodes"; value: string | string[] }
  | { method: FilterMethod; type: "ptiurn"; value: string }
  | { method: FilterMethod; type: "caseAge"; value: string | undefined }
  | { method: "add"; type: "dateFrom"; value: string }
  | { method: "add"; type: "dateTo"; value: string }
  | { method: "remove"; type: "dateRange"; value: string }
  | { method: FilterMethod; type: "lockedState"; value: string }
  | { method: FilterMethod; type: "reason"; value: Reason }
  | { method: FilterMethod; type: "caseState"; value: CaseState }
  | { method: FilterMethodCheckbox; type: "triggerIndeterminate"; value: string | string[] }
  | { method: FilterMethodReasonCheckbox; type: "reasonCodesCheckbox"; value: string }
  | { method: FilterMethod; type: "resolvedByUsername"; value: string }
  | { method: "add"; type: "caseResolvedFrom"; value: string }
  | { method: "add"; type: "caseResolvedTo"; value: string }
  | { method: "remove"; type: "caseResolvedDateRange"; value: string }

export type FilterType =
  | "defendantName"
  | "courtName"
  | "reasonCodes"
  | "ptiurn"
  | "caseAge"
  | "dateFrom"
  | "dateTo"
  | "dateRange"
  | "lockedState"
  | "reason"
  | "caseState"
  | "resolvedByUsername"
  | "caseResolvedDateRange"

export type FilterMethod = "add" | "remove"
export type FilterMethodReasonCheckbox = "add" | "remove"
export type FilterMethodCheckbox = "add" | "remove" | "indeterminate"
export type FilterValue = boolean | string | Reason
export type FilterState = "Selected" | "Applied"
export type Filter = {
  caseAgeFilter: {
    value: string
    state: FilterState
  }[]
  dateFrom: {
    value?: string
    state?: FilterState
  }
  dateTo: {
    value?: string
    state?: FilterState
  }
  lockedStateFilter: {
    value?: string
    state?: FilterState
    label?: string
  }
  caseStateFilter: {
    value?: CaseState
    state?: FilterState
    label?: string
  }
  defendantNameSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  courtNameSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  reasonCodes: {
    value?: string
    state?: FilterState
    label?: string
  }[]
  ptiurnSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  reasonFilter: {
    value?: Reason
    state?: FilterState
  }
  resolvedByUsernameFilter: {
    value?: string
    state?: FilterState
    label?: string
  }
  resolvedFrom: {
    value?: string
    state?: FilterState
  }
  resolvedTo: {
    value?: string
    state?: FilterState
  }
}

export type ReasonCode = {
  value?: string
  state?: FilterState
  label?: string
}
