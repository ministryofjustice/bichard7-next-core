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
    (courtCase.triggerStatus <> :triggerStatus AND courtCase.errorStatus = :triggerStatus)
    OR
    (SELECT COUNT(*) FROM br7own.error_list_triggers AS T1 WHERE T1.error_id = courtCase.errorId AND T1.status = :triggerStatus AND T1.trigger_code NOT IN (:...excludedTriggers)) > 0
  )`,
    {
      triggerStatus: caseState === "Resolved" ? "2" : "1",
      excludedTriggers: getExcludedTriggers(excludedTriggers)
    }
  )

  return query
}

export default leftJoinAndSelectTriggersQuery
