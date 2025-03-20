import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { filterByAllocatedUsername } from "./allocatedUsername"
import { filterByAsn } from "./asn"
import { filterByCaseAge } from "./caseAge"
import { filterByCourtDate } from "./courtDate"
import { filterByCourtName } from "./courtName"
import { filterByDefendantName } from "./defendantName"
import { filterByLockedState } from "./lockedState"
import { filterByPtiurn } from "./ptiurn"
import { filterByReasonAndResolutionStatus } from "./reasonAndResolutionStatus"
import { filterByReasonCodes } from "./reasonCodes"
import { filterByResolvedByUsername } from "./resolvedByUsername"
import { filterByResolvedCaseDateRange } from "./resolvedCaseDateRange"

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
