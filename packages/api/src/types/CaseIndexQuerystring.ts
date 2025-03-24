import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"

export type Filters = Pick<
  ApiCaseQuery,
  | "allocatedUsername"
  | "asn"
  | "caseAge"
  | "caseState"
  | "courtName"
  | "defendantName"
  | "from"
  | "lockedState"
  | "ptiurn"
  | "reason"
  | "reasonCodes"
  | "resolvedByUsername"
  | "resolvedFrom"
  | "resolvedTo"
  | "to"
>
export type Pagination = Pick<ApiCaseQuery, "maxPerPage" | "pageNum">
export type SortOrder = Pick<ApiCaseQuery, "order" | "orderBy">
