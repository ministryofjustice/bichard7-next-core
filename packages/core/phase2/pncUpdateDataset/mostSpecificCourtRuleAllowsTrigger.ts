import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import { TRIGGER_RULE_LIST } from "./TriggerRules"

/* Gets whether the most specific court rule which matches the specified hearing outcome allows the specified trigger to be generated. Returns undefined if there is no matching rule, otherwise whether the matching rule allows the trigger.
 */
const mostSpecificCourtRuleAllowsTrigger = (
  _pncUpdateDataset: PncUpdateDataset,
  _triggerCode: TriggerCode
): boolean | undefined => {
  // Determine the court code from the
  // HearingOutcome/Hearing/CourtHearingLocation/OrganisationUnitCode
  // element. If that element does not exist, just return that there is no matching rule.
  // Look for any rules that govern the combination of court code and trigger.
  // The trigger should be generated if no rule is found, or the rule does not have the value "exclude" (case-insensitive)
  // Search for all the possible rules whose "court" part matches the start of the court code and which also specify a trigger code, in descending order of the length of the "court" part, then all those which do not specify a trigger code, again in descending order of the length of the "court" part.

  const ruleList = TRIGGER_RULE_LIST
  console.log("To be implemented: TriggerBuilder.java:339", !!ruleList)
  return true
}

export default mostSpecificCourtRuleAllowsTrigger
