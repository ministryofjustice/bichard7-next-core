import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import type { Filters, Pagination, SortOrder } from "../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { fetchCaseAges } from "../../../services/db/cases/fetchCaseAges"
import fetchCases from "../../../services/db/cases/fetchCases"

const fetchCasesAndFilter = async (
  database: DatabaseConnection,
  query: ApiCaseQuery,
  user: User
): PromiseResult<CaseIndexMetadata> => {
  const pagination: Pagination = { maxPerPage: query.maxPerPage, pageNum: query.pageNum }
  const sortOrder: SortOrder = { order: query.order, orderBy: query.orderBy }
  const filters: Filters = {
    allocatedUsername: query.allocatedUsername,
    asn: query.asn,
    caseAge: query.caseAge,
    caseState: query.caseState,
    courtDateReceivedDateMismatch: query.courtDateReceivedDateMismatch,
    courtName: query.courtName,
    defendantName: query.defendantName,
    from: query.from,
    lockedState: query.lockedState,
    ptiurn: query.ptiurn,
    reason: query.reason,
    reasonCodes: query.reasonCodes,
    resolvedByUsername: query.resolvedByUsername,
    resolvedFrom: query.resolvedFrom,
    resolvedTo: query.resolvedTo,
    to: query.to
  }

  const caseAges = await fetchCaseAges(database, user)
  if (isError(caseAges)) {
    return caseAges
  }

  const fetchCasesResult = await fetchCases(database, user, pagination, sortOrder, filters)
  if (isError(fetchCasesResult)) {
    return fetchCasesResult
  }

  const { cases, fullCount } = fetchCasesResult

  if (cases.length === 0) {
    return {
      caseAges,
      cases: [],
      returnCases: 0,
      totalCases: 0,
      ...pagination
    } satisfies CaseIndexMetadata
  }

  return {
    caseAges,
    cases,
    returnCases: cases.length,
    totalCases: fullCount,
    ...pagination
  } satisfies CaseIndexMetadata
}

export default fetchCasesAndFilter
