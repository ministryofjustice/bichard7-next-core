import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { Trigger } from "../../phase1/types/Trigger"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

const createTriggerIfNecessary = (
  triggers: Trigger[],
  triggerCode: TriggerCode,
  courtOffenceSequenceNumber: number | undefined,
  _aho: AnnotatedHearingOutcome,
  _acquittedOnAppeal = false
): void => {
  triggers.push({ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber })

  // const forceAllowsTrigger = mostSpecificForceRuleAllowsTrigger(aho, triggerCode) ?? true
  // const courtAllowsTrigger = mostSpecificCourtRuleAllowsTrigger(aho, triggerCode) ?? true
  // const generateTrigger = forceAllowsTrigger && courtAllowsTrigger

  // if (generateTrigger) {
  //   if (acquittedOnAppeal) {
  //     triggerCode = mapTriggerToReverse(triggerCode)
  //   }

  //   triggers.push({ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber })
  // } else if (isForceOwnerOutOfArea(aho)) {
  //   const outOfAreaTriggerCode = TriggerCode.TRPR0027
  //   const forceRuleIncludesOutOfArea = mostSpecificForceRuleAllowsTrigger(aho, outOfAreaTriggerCode) ?? true
  //   if (forceRuleIncludesOutOfArea) {
  //     triggers.push({ code: outOfAreaTriggerCode })
  //   }
  // }

  // return generateTrigger
}

// const isForceOwnerOutOfArea = (pncUpdateDataset: PncUpdateDataset): boolean => {
//   const areaCode = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation?.SecondLevelCode
//   if (areaCode) {
//     const forceCode = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
//     return !!forceCode && forceCode !== areaCode
//   } else {
//     return false
//   }
// }

export default createTriggerIfNecessary
