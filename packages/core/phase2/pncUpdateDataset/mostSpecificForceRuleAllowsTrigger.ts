import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import { TRIGGER_RULE_LIST } from "./TriggerRules"

const mostSpecificForceRuleAllowsTrigger = (
  pncUpdateDataset: PncUpdateDataset,
  triggerCode: TriggerCode
): boolean | undefined => {
  const forceCode = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
  const triggerSpecificForceRules = TRIGGER_RULE_LIST.find(
    (rule) => rule.organisationUnit.OrganisationUnitCode === forceCode && rule.code === triggerCode
  )
  const generalForceRules = TRIGGER_RULE_LIST.find(
    (rule) => rule.organisationUnit.OrganisationUnitCode === forceCode && !rule.code
  )

  const mostSpecificRule = triggerSpecificForceRules?.rule ?? generalForceRules?.rule

  if (mostSpecificRule == IncludeExclude.exclude) {
    return false
  } else if (mostSpecificRule == IncludeExclude.include) {
    return true
  }
}

export default mostSpecificForceRuleAllowsTrigger
