import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type { TriggerCode } from "../../types/TriggerCode"

const mostSpecificForceRuleAllowsTrigger = (
  _pncUpdateDataset: PncUpdateDataset,
  _triggerCode: TriggerCode
): boolean | undefined => {
  console.log("To be implemented: TriggerBuilder.java:300")
  return true
}

// From old Bichard, triggers.properties:
// trigger.rule.23.TRPR9993=exclude
// trigger.rule.53=exclude
// trigger.rule.86.TRPS0002=Exclude
// trigger.rule.53.TRPR9233=include
// trigger.rule.47=include
// # Following rules added for testing br700002562
// trigger.rule.B77=include
// trigger.rule.B772=exclude
// trigger.rule.B7724=include
// trigger.rule.B77249=exclude
// trigger.rule.B772490=include
// trigger.rule.B77.TRPR0014=exclude
// trigger.rule.B772.TRPR0014=include
// trigger.rule.B7724.TRPR0014=exclude
// trigger.rule.B77249.TRPR0014=include
// trigger.rule.B772490.TRPR0014=exclude
// trigger.rule.B78=exclude
// trigger.rule.B782=include
// trigger.rule.B7824=exclude
// trigger.rule.B78249=include
// trigger.rule.B782490=exclude
// trigger.rule.B78.TRPR0014=include
// trigger.rule.B782.TRPR0014=exclude
// trigger.rule.B7824.TRPR0014=include
// trigger.rule.B78249.TRPR0014=exclude
// trigger.rule.B782490.TRPR0014=include

export default mostSpecificForceRuleAllowsTrigger
