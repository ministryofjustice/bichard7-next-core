import errorPaths from "../../phase1/lib/errorPaths"
import getOffenceCode from "../../phase1/lib/offence/getOffenceCode"
import type { Trigger } from "../../phase1/types/Trigger"
import { CjsVerdict } from "../../phase1/types/Verdict"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type { TriggerCode } from "../../types/TriggerCode"
import isRecordableOffence from "../isRecordableOffence"
import createTriggerIfNecessary from "./createTriggerIfNecessary"
import disarrCompatibleResultClass from "./disarrCompatibleResultClass"
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

    let sentDISARR = false
    let addedByCourtTriggerRaised = false
    let addedAtCourtAddToPNCTriggerRaised = false
    let addTICSToOffenceTriggerRaised = false

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
    results?.forEach((result, resultIndex) => {
      const ticsInResult = !!result.NumberOfOffencesTIC
      const acquittedOnAppeal = appealAllowed && result.Verdict === CjsVerdict.NotGuilty
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
        triggerCodes.forEach((triggerCode) => {
          const offenceSeqNr =
            getGenericTriggerCaseOrOffenceLevelIndicator(triggerCode) === offenceLevelTrigger
              ? offence.CourtOffenceSequenceNumber
              : undefined
          createTriggerIfNecessary(triggers, triggerCode, offenceSeqNr, pncUpdateDataset, acquittedOnAppeal)
        })
      }

      const errorPath = errorPaths.offence(offenceIndex).result(resultIndex).resultVariableText
      const disposalTextError = pncUpdateDataset.Exceptions.find((e) => e.code === "HO200200" && e.path === errorPath)
      if (disposalTextError) {
        createTriggerIfNecessary(
          triggers,
          "TRPS0003" as TriggerCode,
          offence.CourtOffenceSequenceNumber,
          pncUpdateDataset,
          acquittedOnAppeal
        )
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
            createTriggerIfNecessary(
              triggers,
              "TRPS0010" as TriggerCode,
              offence.CourtOffenceSequenceNumber,
              pncUpdateDataset,
              acquittedOnAppeal
            )
            addedByCourtTriggerRaised = true
          }
        } else {
          if (!addedAtCourtAddToPNCTriggerRaised && offence.AddedByTheCourt) {
            createTriggerIfNecessary(
              triggers,
              "TRPS0011" as TriggerCode,
              offence.CourtOffenceSequenceNumber,
              pncUpdateDataset,
              acquittedOnAppeal
            )
            addedAtCourtAddToPNCTriggerRaised = true
          }

          if (!addTICSToOffenceTriggerRaised && ticsInResult && !sentDISARR) {
            createTriggerIfNecessary(
              triggers,
              "TRPS0013" as TriggerCode,
              offence.CourtOffenceSequenceNumber,
              pncUpdateDataset,
              false
            )
            addTICSToOffenceTriggerRaised = true
          }
        }
      }
    })
  }

  const newremCount = pncUpdateDataset.PncOperations.filter((op) => op.code === "NEWREM").length
  if (newremCount > 1) {
    createTriggerIfNecessary(triggers, "TRPS0004" as TriggerCode, undefined, pncUpdateDataset, false)
  }

  return triggers
}

export default identifyPostUpdateTriggers
