import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import errorPaths from "../../phase1/lib/errorPaths"
import getOffenceCode from "../../phase1/lib/offence/getOffenceCode"
import type { Trigger } from "../../phase1/types/Trigger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import isRecordableOffence from "../isRecordableOffence"
import disarrCompatibleResultClass from "../lib/deriveOperationSequence/disarrCompatibleResultClass"
import getGenericTriggerCaseOrOffenceLevelIndicator from "./getGenericTriggerCaseOrOffenceLevelIndicator"
import getResultCodeValuesForTriggerCode from "./getResultCodeValuesForTriggerCode"
import isResultVariableTextForTriggerMatch from "./isResultVariableTextForTriggerMatch"
import isResultVariableTextNotForTriggerMatch from "./isResultVariableTextNotForTriggerMatch"

const restrainingOrderCJSResultCodes = getResultCodeValuesForTriggerCode(TriggerCode.TRPS0001)
const offenceLevelTrigger = "0"
const postUpdateTriggersMap: Record<string, TriggerCode[]> = {
  "3107": [TriggerCode.TRPS0002],
  "3105": [TriggerCode.TRPS0008]
}

const identifyPostUpdateTriggers = (pncUpdateDataset: PncUpdateDataset): Trigger[] => {
  const offences = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const triggers: Trigger[] = []

  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offences[offenceIndex]
    const offenceCode = offence ? getOffenceCode(offence) : undefined
    let sentDISARR = false
    let addedByCourtTriggerRaised = false
    let addedAtCourtAddToPNCTriggerRaised = false
    let addTICSToOffenceTriggerRaised = false

    let offenceTriggerCodes = offenceCode ? postUpdateTriggersMap[offenceCode] : undefined
    if (offenceCode && offenceCode.length == 8) {
      const baseOffenceTriggerCodes = postUpdateTriggersMap[offenceCode.substring(0, 7)]
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
        triggers.push({ code: offenceTriggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
      } else {
        triggers.push({ code: offenceTriggerCode })
      }
    })

    const results = offence
      ? offence.Result
      : pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result
      ? [pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result]
      : undefined
    results?.forEach((result, resultIndex) => {
      const ticsInResult = !!result.NumberOfOffencesTIC
      if (restrainingOrderCJSResultCodes.includes(result.CJSresultCode)) {
        if (
          pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtType === "CC" ||
          (result.ResultVariableText &&
            isResultVariableTextForTriggerMatch(TriggerCode.TRPS0001, result.ResultVariableText) &&
            !isResultVariableTextNotForTriggerMatch(TriggerCode.TRPS0001, result.ResultVariableText))
        ) {
          triggers.push({ code: TriggerCode.TRPS0001, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
        }
      }

      const triggerCodes = postUpdateTriggersMap[result.CJSresultCode]
      if (triggerCodes) {
        triggerCodes.forEach((triggerCode) => {
          const offenceSeqNr =
            getGenericTriggerCaseOrOffenceLevelIndicator(triggerCode) === offenceLevelTrigger
              ? offence.CourtOffenceSequenceNumber
              : undefined
          triggers.push({ code: triggerCode, offenceSequenceNumber: offenceSeqNr })
        })
      }

      const errorPath = errorPaths.offence(offenceIndex).result(resultIndex).resultVariableText
      const disposalTextError = pncUpdateDataset.Exceptions.find((e) => e.code === "HO200200" && e.path === errorPath)
      if (disposalTextError) {
        triggers.push({ code: TriggerCode.TRPS0003, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
      }

      if (offence.AddedByTheCourt || (ticsInResult && isRecordableOffence(offence))) {
        pncUpdateDataset.PncOperations.forEach((operation) => {
          if (operation.code === "DISARR" && operation.status?.toUpperCase() === "C") {
            const ccr = operation.data?.courtCaseReference
            if (!ccr || ccr === offence.CourtCaseReferenceNumber) {
              sentDISARR = true
            }
          }
        })
        if (sentDISARR && offence.AddedByTheCourt && disarrCompatibleResultClass(offence)) {
          if (!addedByCourtTriggerRaised) {
            triggers.push({ code: TriggerCode.TRPS0010, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
            addedByCourtTriggerRaised = true
          }
        } else {
          if (!addedAtCourtAddToPNCTriggerRaised && offence.AddedByTheCourt) {
            triggers.push({ code: TriggerCode.TRPS0011, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
            addedAtCourtAddToPNCTriggerRaised = true
          }

          if (!addTICSToOffenceTriggerRaised && ticsInResult && !sentDISARR) {
            triggers.push({ code: TriggerCode.TRPS0013, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
            addTICSToOffenceTriggerRaised = true
          }
        }
      }
    })
  }

  const newremCount = pncUpdateDataset.PncOperations.filter((op) => op.code === "NEWREM").length
  if (newremCount > 1) {
    triggers.push({ code: TriggerCode.TRPS0004 })
  }

  return triggers
}

export default identifyPostUpdateTriggers
