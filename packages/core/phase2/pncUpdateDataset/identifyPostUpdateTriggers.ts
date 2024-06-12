import getOffenceCode from "../../phase1/lib/offence/getOffenceCode"
import type { Trigger } from "../../phase1/types/Trigger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type { TriggerCode } from "../../types/TriggerCode"
import isRecordableOffence from "../isRecordableOffence"
import createTriggerIfNecessary from "./createTriggerIfNecessary"
import getGenericTriggerCaseOrOffenceLevelIndicator from "./getGenericTriggerCaseOrOffenceLevelIndicator"
import getResultCodeValuesForTriggerCode from "./getResultCodeValuesForTriggerCode"
import getUpdateTriggersMap from "./getUpdateTriggersMap"
import isAppealAllowed from "./isAppealAllowed"
import isResultVariableTextForTriggerMatch from "./isResultVariableTextForTriggerMatch"
import isResultVariableTextNotForTriggerMatch from "./isResultVariableTextNotForTriggerMatch"

// TODO: Add TRPS0001 to TriggerCode enum
const restrainingOrderCJSResultCodes = getResultCodeValuesForTriggerCode("TRPS0001" as TriggerCode)
const offenceLevelTrigger = "0"

const identifyPostUpdateTriggers = (pncUpdateDataset: PncUpdateDataset): Trigger[] => {
  const offences = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const triggers: Trigger[] = []
  const postUpdateTriggers = getUpdateTriggersMap("post")

  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offences[offenceIndex]
    const offenceCode = offence ? getOffenceCode(offence) : undefined

    const appealAllowed = isAppealAllowed(offence)

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

    offenceTriggerCodes?.forEach((offenceTriggerCode) => {
      if (getGenericTriggerCaseOrOffenceLevelIndicator(offenceTriggerCode) === offenceLevelTrigger) {
        createTriggerIfNecessary(
          triggers,
          offenceTriggerCode,
          offence.CourtOffenceSequenceNumber,
          pncUpdateDataset,
          false
        )
      } else {
        createTriggerIfNecessary(triggers, offenceTriggerCode, undefined, pncUpdateDataset, false)
      }
    })

    const results = offence
      ? offence.Result
      : pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result
      ? [pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result]
      : undefined
    results?.forEach((result) => {
      const ticsInResult = !!result.NumberOfOffencesTIC
      const acquittedOnAppeal = appealAllowed && result.Verdict === "NG"
      if (restrainingOrderCJSResultCodes.includes(result.CJSresultCode)) {
        if (
          pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtType === "CC" ||
          (result.ResultVariableText &&
            // TODO: Add TRPS0001 to TriggerCode enum
            isResultVariableTextForTriggerMatch("TRPS0001" as TriggerCode, result.ResultVariableText) &&
            !isResultVariableTextNotForTriggerMatch("TRPS0001" as TriggerCode, result.ResultVariableText))
        ) {
          createTriggerIfNecessary(
            triggers,
            "TRPS0001" as TriggerCode,
            offence.CourtOffenceSequenceNumber,
            pncUpdateDataset,
            acquittedOnAppeal
          )
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
