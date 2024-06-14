import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import { TRIGGER_RULE_LIST } from "./TriggerRules"

const mostSpecificForceRuleAllowsTrigger = (
  pncUpdateDataset: PncUpdateDataset,
  triggerCode: TriggerCode
): boolean | undefined => {
  const forceCode = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
  const forceRules = TRIGGER_RULE_LIST.filter(
    (rule) =>
      rule.organisationUnit.OrganisationUnitCode === forceCode &&
      (!rule.code || rule.code === triggerCode) &&
      rule.rule === "exclude"
  )
  if (forceRules.length > 0) {
    return false
  }

  console.log(TRIGGER_RULE_LIST)
  return true
}

export default mostSpecificForceRuleAllowsTrigger
