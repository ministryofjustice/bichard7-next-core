import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import { TRIGGER_RULE_LIST } from "./TriggerRules"

const mostSpecificCourtRuleAllowsTrigger = (
  _pncUpdateDataset: PncUpdateDataset,
  _triggerCode: TriggerCode
): boolean | undefined => {
  const ruleList = TRIGGER_RULE_LIST
  console.log("To be implemented: TriggerBuilder.java:339", !!ruleList)
  return true
}

export default mostSpecificCourtRuleAllowsTrigger
