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
  orderBy?: string
  order?: QueryOrder
  reasons?: Reason[]
  defendantName?: string
  courtName?: string
  ptiurn?: string
  urgent?: Urgency
  forces: string[]
  pageNum?: string
  maxPageItems: string
  courtDateRange?: CourtDateRange | CourtDateRange[]
  locked?: boolean
  caseState?: CaseState
  allocatedToUserName?: string
  reasonCode?: string
  resolvedByUsername?: string
}
