import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { filterByCaseAge } from "./caseAge"
import { filterByAllocatedUsername } from "./filterByAllocatedUsername"
import { filterByAsn } from "./filterByAsn"
import { filterByCourtDate } from "./filterByCourtDate"
import { filterByCourtName } from "./filterByCourtName"
import { filterByDefendantName } from "./filterByDefendantName"
import { filterByLockedState } from "./filterByLockedState"
import { filterByPtiurn } from "./filterByPtiurn"
import { filterByReasonAndResolutionStatus } from "./filterByReasonAndResolutionStatus"
import { filterByReasonCodes } from "./filterByReasonCodes"
import { filterByResolvedByUsername } from "./filterByResolvedByUsername"
import { filterByResolvedCaseDateRange } from "./filterByResolvedCaseDateRange"

export const generateFilters = (sql: postgres.Sql, user: User, filters: Filters): postgres.PendingQuery<Row[]> => {
  const queries = [
    filterByDefendantName(sql, filters.defendantName),
    filterByCourtName(sql, filters.courtName),
    filterByPtiurn(sql, filters.ptiurn),
    filterByAsn(sql, filters.asn),
    filterByReasonCodes(sql, filters),
    filterByCourtDate(sql, filters),
    filterByCaseAge(sql, filters.caseAge),
    filterByResolvedByUsername(sql, filters),
    filterByReasonAndResolutionStatus(sql, user, filters),
    filterByLockedState(sql, user, filters),
    filterByResolvedCaseDateRange(sql, filters),
    filterByAllocatedUsername(sql, filters.allocatedUsername)
  ]

  return sql`
    ${queries.map((q) => sql`${q}`)}
  `
}
