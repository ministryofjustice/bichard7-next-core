import getOffenceCode from "../../phase1/lib/offence/getOffenceCode"
import type { Trigger } from "../../phase1/types/Trigger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type { TriggerCode } from "../../types/TriggerCode"
import isRecordableOffence from "../isRecordableOffence"
import getResultCodeValuesForTriggerCode from "./getResultCodeValuesForTriggerCode"
import getUpdateTriggersMap from "./getUpdateTriggersMap"
import isResultVariableTextForTriggerMatch from "./isResultVariableTextForTriggerMatch"
import isResultVariableTextNotForTriggerMatch from "./isResultVariableTextNotForTriggerMatch"

console.log("TODO: Add TRPS0001 to TriggerCode enum")
const restrainingOrderCJSResultCodes = getResultCodeValuesForTriggerCode("TRPS0001" as TriggerCode)

const identifyPostUpdateTriggers = (pncUpdateDataset: PncUpdateDataset): Trigger[] => {
  const offences = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const postUpdateTriggers = getUpdateTriggersMap("post")

  console.log("To be implemented: TriggerBuilder.java:1003")

  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offences[offenceIndex]
    const offenceCode = offence ? getOffenceCode(offence) : undefined

    console.log("To be implemented: TriggerBuilder.java:1029")

    let offenceTriggerCodes = offenceCode ? postUpdateTriggers[offenceCode] : undefined
    if (offenceCode && offenceCode.length == 8) {
      const baseOffenceTriggerCodes = postUpdateTriggers[offenceCode.substring(0, 7)]
      if (!offenceTriggerCodes) {
        offenceTriggerCodes = baseOffenceTriggerCodes
      } else {
        if (baseOffenceTriggerCodes) {
          offenceTriggerCodes.push(...baseOffenceTriggerCodes)
        }
      }
    }

    offenceTriggerCodes?.forEach((_offenceTriggerCode) => {
      console.log("To be implemented: TriggerBuilder.java:1094")
    })

    const results = offence
      ? offence.Result
      : pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result
      ? [pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result]
      : undefined
    results?.forEach((result) => {
      const ticsInResult = !!result.NumberOfOffencesTIC

      if (restrainingOrderCJSResultCodes.includes(result.CJSresultCode)) {
        if (
          pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtType === "CC" ||
          (result.ResultVariableText &&
            isResultVariableTextForTriggerMatch("TRPS0001" as TriggerCode, result.ResultVariableText) &&
            !isResultVariableTextNotForTriggerMatch("TRPS0001" as TriggerCode, result.ResultVariableText))
        ) {
          console.log("To be implemented: TriggerBuilder.java:1147")
        }
      }

      const triggerCodes = postUpdateTriggers[result.CJSresultCode]
      if (triggerCodes) {
        console.log("To be implemented: TriggerBuilder.java:1165")
      }

      console.log("To be implemented: TriggerBuilder.java:1206 to 1216")

      if (offence.AddedByTheCourt || (ticsInResult && isRecordableOffence(offence))) {
        console.log("To be implemented: TriggerBuilder.java:1256")
      }
    })
  }

  pncUpdateDataset.PncOperations.forEach((_operation) => {
    console.log("To be implemented: TriggerBuilder.java:1334 to 1355")
  })

  return []
}

export default identifyPostUpdateTriggers
