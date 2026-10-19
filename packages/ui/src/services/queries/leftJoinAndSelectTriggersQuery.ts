import type { SelectQueryBuilder } from "typeorm"
import type { CaseState } from "types/CaseListQueryParams"
import type CourtCase from "../entities/CourtCase"
import { getExcludedTriggers } from "../listCourtCases"

const leftJoinAndSelectTriggersQuery = (
  query: SelectQueryBuilder<CourtCase>,
  excludedTriggers?: string[],
  reasonCodes: string[] = [],
  caseState?: CaseState
): SelectQueryBuilder<CourtCase> => {
  query.leftJoinAndSelect(
    "courtCase.triggers",
    "trigger",
    "trigger.triggerCode NOT IN (:...excludedTriggers)" +
      (caseState === undefined ? "" : " AND trigger.status = :triggerStatus"),
    {
      excludedTriggers: getExcludedTriggers(excludedTriggers, reasonCodes),
      triggerStatus: caseState === "Resolved" ? "2" : "1"
    }
  )

  return query
}

export default leftJoinAndSelectTriggersQuery
