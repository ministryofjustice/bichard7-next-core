import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

const mostSpecificForceRuleAllowsTrigger = (
  _pncUpdateDataset: PncUpdateDataset,
  _triggerCode: TriggerCode
): boolean | undefined => {
  console.log("To be implemented: TriggerBuilder.java:300")
  return true
}

export default mostSpecificForceRuleAllowsTrigger
