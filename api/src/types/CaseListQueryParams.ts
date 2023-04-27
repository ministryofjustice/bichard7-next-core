export type QueryOrder = "asc" | "desc"

export type Reason = "Triggers" | "Exceptions" | "Bails"

export type CourtDateRange = {
  from: Date
  to: Date
}

export type SerializedCourtDateRange = {
  from?: string
  to?: string
}

export type CaseState = "Resolved" | "Unresolved and resolved" | undefined

export type Urgency = "Urgent" | "Non-urgent" | undefined

export type CaseListQueryParams = {
  forces: string[]
  maxPageItems: string
  allocatedToUserName?: string
  caseState?: CaseState
  courtDateRange?: CourtDateRange | CourtDateRange[]
  courtName?: string
  defendantName?: string
  locked?: boolean
  order?: QueryOrder
  orderBy?: string
  pageNum?: string
  ptiurn?: string
  reasonCode?: string
  reasons?: Reason[]
  resolvedByUsername?: string
  urgent?: Urgency
}
