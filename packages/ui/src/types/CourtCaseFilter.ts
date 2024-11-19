import type { CaseState, Reason } from "./CaseListQueryParams"

export type FilterAction =
  | { method: "add"; type: "caseResolvedFrom"; value: string }
  | { method: "add"; type: "caseResolvedTo"; value: string }
  | { method: "add"; type: "dateFrom"; value: string }
  | { method: "add"; type: "dateTo"; value: string }
  | { method: "remove"; type: "caseResolvedDateRange"; value: string }
  | { method: "remove"; type: "dateRange"; value: string }
  | { method: FilterMethod; type: "caseAge"; value: string }
  | { method: FilterMethod; type: "caseState"; value: CaseState }
  | { method: FilterMethod; type: "courtName"; value: string }
  | { method: FilterMethod; type: "defendantName"; value: string }
  | { method: FilterMethod; type: "lockedState"; value: string }
  | { method: FilterMethod; type: "ptiurn"; value: string }
  | { method: FilterMethod; type: "reason"; value: Reason }
  | { method: FilterMethod; type: "reasonCodes"; value: string | string[] }
  | { method: FilterMethod; type: "resolvedByUsernameFilter"; value: string }
  | { method: FilterMethodCheckbox; type: "triggerIndeterminate"; value: string | string[] }
  | { method: FilterMethodReasonCheckbox; type: "reasonCodesCheckbox"; value: string }

export type FilterType =
  | "caseAge"
  | "caseResolvedDateRange"
  | "caseState"
  | "courtName"
  | "dateFrom"
  | "dateRange"
  | "dateTo"
  | "defendantName"
  | "lockedState"
  | "ptiurn"
  | "reason"
  | "reasonCodes"
  | "resolvedByUsername"

export type FilterMethod = "add" | "remove"
export type FilterMethodReasonCheckbox = "add" | "remove"
export type FilterMethodCheckbox = "add" | "indeterminate" | "remove"
export type FilterValue = boolean | Reason | string
export type FilterState = "Applied" | "Selected"
export type Filter = {
  caseAgeFilter: {
    state: FilterState
    value: string
  }[]
  caseStateFilter: {
    label?: string
    state?: FilterState
    value?: CaseState
  }
  courtNameSearch: {
    label?: string
    state?: FilterState
    value?: string
  }
  dateFrom: {
    state?: FilterState
    value?: string
  }
  dateTo: {
    state?: FilterState
    value?: string
  }
  defendantNameSearch: {
    label?: string
    state?: FilterState
    value?: string
  }
  lockedStateFilter: {
    label?: string
    state?: FilterState
    value?: string
  }
  ptiurnSearch: {
    label?: string
    state?: FilterState
    value?: string
  }
  reasonCodes: {
    label?: string
    state?: FilterState
    value?: string
  }[]
  reasonFilter: {
    state?: FilterState
    value?: Reason
  }
  resolvedByUsernameFilter: {
    label?: string
    state?: FilterState
    value?: string
  }
  resolvedFrom: {
    state?: FilterState
    value?: string
  }
  resolvedTo: {
    state?: FilterState
    value?: string
  }
}

export type ReasonCode = {
  label?: string
  state?: FilterState
  value?: string
}
