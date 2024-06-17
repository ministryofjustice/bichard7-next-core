import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { Trigger } from "../../phase1/types/Trigger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import mapTriggerToReverse from "./mapTriggerToReverse"
import mostSpecificCourtRuleAllowsTrigger from "./mostSpecificCourtRuleAllowsTrigger"
import mostSpecificForceRuleAllowsTrigger from "./mostSpecificForceRuleAllowsTrigger"

const createTriggerIfNecessary = (
  triggers: Trigger[],
  triggerCode: TriggerCode,
  courtOffenceSequenceNumber: number | undefined,
  pncUpdateDataset: PncUpdateDataset,
  acquittedOnAppeal = false
): boolean => {
  const forceAllowsTrigger = mostSpecificForceRuleAllowsTrigger(pncUpdateDataset, triggerCode) ?? true
  const courtAllowsTrigger = mostSpecificCourtRuleAllowsTrigger(pncUpdateDataset, triggerCode) ?? true
  const generateTrigger = forceAllowsTrigger && courtAllowsTrigger

  if (generateTrigger) {
    if (acquittedOnAppeal) {
      triggerCode = mapTriggerToReverse(triggerCode)
    }

    triggers.push({ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber })
  } else if (isForceOwnerOutOfArea(pncUpdateDataset)) {
    const outOfAreaTriggerCode = TriggerCode.TRPR0027
    const forceRuleIncludesOutOfArea =
      mostSpecificForceRuleAllowsTrigger(pncUpdateDataset, outOfAreaTriggerCode) ?? true
    if (forceRuleIncludesOutOfArea) {
      triggers.push({ code: outOfAreaTriggerCode })
    }
  }

  return generateTrigger
}

const isForceOwnerOutOfArea = (pncUpdateDataset: PncUpdateDataset): boolean => {
  const areaCode = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation?.SecondLevelCode
  if (areaCode) {
    const forceCode = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
    return !!forceCode && forceCode !== areaCode
  } else {
    return false
  }
}

export default createTriggerIfNecessary
