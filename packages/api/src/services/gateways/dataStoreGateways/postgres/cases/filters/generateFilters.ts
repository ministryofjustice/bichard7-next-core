import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { filterByCourtName } from "./courtName"
import { filterByDefendantName } from "./defendantName"
import { filterByAsn } from "./filterByAsn"
import { filterByPtiurn } from "./filterByPtiurn"
import { filterByReasonAndResolutionStatus } from "./filterByReasonAndResolutionStatus"
import { filterByReasonCodes } from "./reasonCodes"
import { filterByResolvedByUsername } from "./resolvedByUsername"

export const generateFilters = (sql: postgres.Sql, user: User, filters: Filters): postgres.PendingQuery<Row[]> => {
  const queries = [
    filterByDefendantName(sql, filters.defendantName),
    filterByCourtName(sql, filters.courtName),
    filterByPtiurn(sql, filters.ptiurn),
    filterByAsn(sql, filters.asn),
    filterByReasonCodes(sql, filters),
    filterByResolvedByUsername(sql, filters),
    filterByReasonAndResolutionStatus(sql, user, filters)
  ]

  return sql`
    ${queries.map((q) => sql`${q}`)}
  `
}
