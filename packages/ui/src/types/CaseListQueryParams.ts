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

export type DateRange = {
  from: Date
  to: Date
}

export type SerializedDateRange = {
  from?: string
  to?: string
}

export type CaseState = "Resolved" | "Unresolved" | undefined

export type CaseListQueryParams = {
  allocatedToUserName?: string
  caseState?: CaseState
  courtDateRange?: DateRange | DateRange[]
  courtName?: string
  defendantName?: string
  lockedState?: string
  maxPageItems?: number
  order?: QueryOrder
  orderBy?: string
  page?: number
  ptiurn?: string
  reason?: Reason
  reasonCodes?: string[]
  resolvedByUsername?: string
  resolvedDateRange?: DateRange
  asn?: string
}
