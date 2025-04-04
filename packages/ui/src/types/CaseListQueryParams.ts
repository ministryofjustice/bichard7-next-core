import type { DateRange } from "@moj-bichard7/common/types/DateRange"

export type QueryOrder = "asc" | "desc"

export enum Reason {
  All = "All",
  Exceptions = "Exceptions",
  Triggers = "Triggers"
}

export enum LockedState {
  All = "All",
  Locked = "Locked",
  Unlocked = "Unlocked",
  LockedToMe = "LockedToMe"
}

export type SerializedDateRange = {
  from?: string
  to?: string
}

export type CaseState = "Resolved" | "Unresolved" | undefined

export type CaseListQueryParams = {
  allocatedToUserName?: string
  caseState?: CaseState
  caseAge?: string[]
  courtDateRange?: DateRange | DateRange[]
  courtName?: string
  defendantName?: string
  from?: string | undefined
  to?: string | undefined
  lockedState?: string
  maxPageItems?: number
  order?: QueryOrder
  orderBy?: string
  page?: number
  ptiurn?: string
  reason?: Reason
  reasonCodes?: (string | undefined)[]
  resolvedByUsername?: string
  resolvedDateRange?: DateRange
  resolvedFrom?: string
  resolvedTo?: string
  state?: string
  asn?: string
}
