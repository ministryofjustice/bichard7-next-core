import type { Trigger } from "../../phase1/types/Trigger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import mostSpecificForceRuleAllowsTrigger from "./mostSpecificForceRuleAllowsTrigger"
import mostSpecificCourtRuleAllowsTrigger from "./mostSpecificCourtRuleAllowsTrigger"
import { TriggerCode } from "../../types/TriggerCode"
import mapTriggerToReverse from "./mapTriggerToReverse"

const createTriggerIfNecessary = (
  triggers: Trigger[],
  triggerCode: TriggerCode,
  courtOffenceSequenceNumber: number | undefined,
  pncUpdateDataset: PncUpdateDataset,
  acquittedOnAppeal = false
): boolean => {
  const forceRule = mostSpecificForceRuleAllowsTrigger(pncUpdateDataset, triggerCode)
  const courtRule = mostSpecificCourtRuleAllowsTrigger(pncUpdateDataset, triggerCode)
  let generateTrigger = true
  if (forceRule == undefined && courtRule == undefined) {
    generateTrigger = true
  } else if (courtRule == undefined) {
    generateTrigger = forceRule as boolean
  } else if (forceRule == undefined) {
    generateTrigger = courtRule
  } else {
    generateTrigger = forceRule || courtRule
  }

  if (generateTrigger) {
    if (acquittedOnAppeal) {
      triggerCode = mapTriggerToReverse(triggerCode)
    }

    triggers.push({ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber })
  } else {
    const courtHearingLocation = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation
    if (courtHearingLocation && courtHearingLocation.SecondLevelCode) {
      const areaCode = courtHearingLocation.SecondLevelCode
      const forceCode = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode

      if (forceCode && forceCode !== areaCode) {
        const forceRuleIncludesOutOfArea = mostSpecificForceRuleAllowsTrigger(pncUpdateDataset, TriggerCode.TRPR0027)
        if (forceRuleIncludesOutOfArea === undefined || forceRuleIncludesOutOfArea) {
          triggers.push({ code: TriggerCode.TRPR0027 })
        }
      }
    }
  }

  return generateTrigger
}

export default createTriggerIfNecessary
