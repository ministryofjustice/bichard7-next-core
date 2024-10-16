import type { SelectQueryBuilder } from "typeorm"
import type { CaseState } from "types/CaseListQueryParams"
import type CourtCase from "../entities/CourtCase"

const getExcludedTriggers = (excludedTriggers?: string[]): string[] =>
  excludedTriggers && excludedTriggers.length > 0 ? excludedTriggers : [""]

const leftJoinAndSelectTriggersQuery = (
  query: SelectQueryBuilder<CourtCase>,
  excludedTriggers?: string[],
  caseState?: CaseState
): SelectQueryBuilder<CourtCase> => {
  query.leftJoinAndSelect(
    "courtCase.triggers",
    "trigger",
    "trigger.triggerCode NOT IN (:...excludedTriggers)" +
      (caseState === undefined ? "" : " AND trigger.status = :triggerStatus"),
    {
      excludedTriggers: getExcludedTriggers(excludedTriggers),
      triggerStatus: caseState === "Resolved" ? "2" : "1"
    }
  )
  return query
}

export default leftJoinAndSelectTriggersQuery
