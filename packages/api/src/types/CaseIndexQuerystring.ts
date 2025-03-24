import type { ApiCaseQuerystring } from "@moj-bichard7/common/types/ApiCaseQuerystring"

export type Filters = Pick<
  ApiCaseQuerystring,
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
export type Pagination = Pick<ApiCaseQuerystring, "maxPerPage" | "pageNum">
export type SortOrder = Pick<ApiCaseQuerystring, "order" | "orderBy">
