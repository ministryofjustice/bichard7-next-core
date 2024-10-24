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

  query.where(
    `(
    courtCase.errorStatus = :caseStatus
    OR
    (SELECT COUNT(*) FROM br7own.error_list_triggers AS T1 WHERE T1.error_id = courtCase.errorId AND T1.status = :caseStatus AND T1.trigger_code NOT IN (:...excludedTriggers)) > 0
  )`,
    {
      caseStatus: caseState === "Resolved" ? "2" : "1",
      excludedTriggers: getExcludedTriggers(excludedTriggers)
    }
  )

  return query
}

export default leftJoinAndSelectTriggersQuery
