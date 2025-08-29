import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

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
import { filterByShowCasesWithDateDifference } from "./showCasesWithDateDifference"

export const generateFilters = (
  database: DatabaseConnection,
  user: User,
  filters: Filters
): postgres.PendingQuery<Row[]> => {
  const queries = [
    filterByDefendantName(database, filters.defendantName),
    filterByCourtName(database, filters.courtName),
    filterByPtiurn(database, filters.ptiurn),
    filterByAsn(database, filters.asn),
    filterByReasonCodes(database, filters),
    filterByCourtDate(database, filters),
    filterByCaseAge(database, filters.caseAge),
    filterByResolvedByUsername(database, filters.resolvedByUsername),
    filterByReasonAndResolutionStatus(database, user, filters),
    filterByLockedState(database, user, filters.lockedState),
    filterByResolvedCaseDateRange(database, filters),
    filterByAllocatedUsername(database, filters.allocatedUsername),
    filterByShowCasesWithDateDifference(database, filters.showCasesWithDateDifference)
  ]

  return database.connection`
    ${queries.map((q) => database.connection`${q}`)}
  `
}
