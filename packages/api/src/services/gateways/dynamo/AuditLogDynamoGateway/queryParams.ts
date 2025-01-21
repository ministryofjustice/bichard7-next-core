import type { DynamoAuditLog } from "../../../../types/AuditLog"

export type EventsFilterOptions = {
  eventsFilter?: "automationReport" | "topExceptionsReport"
}

export type FetchByStatusOptions = PaginationOptions & ProjectionOptions

export type FetchManyOptions = PaginationOptions & ProjectionOptions

export type FetchOneOptions = ProjectionOptions & ReadConsistency

export type FetchRangeOptions = EventsFilterOptions & PaginationOptions & ProjectionOptions & RangeQueryOptions

export type FetchReportOptions = PaginationOptions & RangeQueryOptions
export type FetchUnsanitisedOptions = PaginationOptions & ProjectionOptions
export type PaginationOptions = {
  lastMessage?: DynamoAuditLog
  lastMessageId?: string
  limit?: number
}
export type ProjectionOptions = {
  excludeColumns?: string[]
  includeColumns?: string[]
}
export type RangeQueryOptions = {
  end: Date
  start: Date
}
export type ReadConsistency = {
  stronglyConsistentRead?: boolean
}
