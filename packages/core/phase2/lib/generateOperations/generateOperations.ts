import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../types/Exception"
import type { Operation } from "../../../types/PncUpdateDataset"
import ResultClass from "../../../types/ResultClass"
import isRecordableOffence from "../isRecordableOffence"
import isRecordableResult from "../isRecordableResult"
import validateOperations from "./validateOperations"
import deduplicateOperations from "./deduplicateOperations"
import extractRemandCcrs from "./extractRemandCcrs"
import filterDisposalsAddedInCourt from "./filterDisposalsAddedInCourt"
import { handleAdjournment } from "./resultClassHandlers/handleAdjournment"
import { handleAdjournmentPostJudgement } from "./resultClassHandlers/handleAdjournmentPostJudgement"
import { handleAdjournmentPreJudgement } from "./resultClassHandlers/handleAdjournmentPreJudgement"
import { handleAdjournmentWithJudgement } from "./resultClassHandlers/handleAdjournmentWithJudgement"
import { handleJudgementWithFinalResult } from "./resultClassHandlers/handleJudgementWithFinalResult"
import { handleSentence } from "./resultClassHandlers/handleSentence"
import type { ResultClassHandler } from "./resultClassHandlers/ResultClassHandler"
import type ExceptionsAndOperations from "./ExceptionsAndOperations"
import { areAllResultsOnPnc } from "./areAllResultsOnPnc"
import sortOperations from "./sortOperations"
import { PncOperation } from "../../../types/PncOperation"
import EventCode from "@moj-bichard7/common/types/EventCode"

const resultClassHandlers: Record<ResultClass, ResultClassHandler> = {
  [ResultClass.ADJOURNMENT]: handleAdjournment,
  [ResultClass.ADJOURNMENT_PRE_JUDGEMENT]: handleAdjournmentPreJudgement,
  [ResultClass.ADJOURNMENT_WITH_JUDGEMENT]: handleAdjournmentWithJudgement,
  [ResultClass.ADJOURNMENT_POST_JUDGEMENT]: handleAdjournmentPostJudgement,
  [ResultClass.JUDGEMENT_WITH_FINAL_RESULT]: handleJudgementWithFinalResult,
  [ResultClass.SENTENCE]: handleSentence,
  [ResultClass.UNRESULTED]: () => ({ operations: [], exceptions: [] })
}

const generateOperationsFromResults = (
  aho: AnnotatedHearingOutcome,
  resubmitted: boolean,
  allResultsOnPnc: boolean
) => {
  const exceptions: Exception[] = []
  const operations: Operation[] = []

  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence, offenceIndex) => {
    if (!isRecordableOffence(offence)) {
      return
    }

    offence.Result.forEach((result, resultIndex) => {
      if (!isRecordableResult(result)) {
        return
      }

      if (result.ResultClass) {
        const handlerResult = resultClassHandlers[result.ResultClass]?.({
          aho,
          offenceIndex,
          offence,
          resultIndex,
          result,
          resubmitted,
          allResultsAlreadyOnPnc: allResultsOnPnc
        })

        exceptions.push(...handlerResult.exceptions)
        operations.push(...handlerResult.operations)
      }
    })
  })

  return { operations: filterDisposalsAddedInCourt(operations), exceptions }
}

const generateOperations = (aho: AnnotatedHearingOutcome, resubmitted: boolean): ExceptionsAndOperations => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  if (offences.filter(isRecordableOffence).length === 0) {
    return { exceptions: [], operations: [] }
  }

  const allResultsOnPnc = areAllResultsOnPnc(aho)
  const { operations, exceptions } = generateOperationsFromResults(aho, resubmitted, allResultsOnPnc)

  const remandCcrs = extractRemandCcrs(operations, false)
  const deduplicatedOperations = deduplicateOperations(operations)
  const validateOperationException = validateOperations(deduplicatedOperations, remandCcrs)

  if (validateOperationException) {
    exceptions.push(validateOperationException)
  }

  if (exceptions.length > 0) {
    return { operations: [], exceptions }
  }

  const filteredOperations = allResultsOnPnc
    ? deduplicatedOperations.filter((operation) => operation.code === PncOperation.REMAND)
    : deduplicatedOperations

  return {
    operations: sortOperations(filteredOperations),
    exceptions: [],
    events: allResultsOnPnc ? [EventCode.IgnoredAlreadyOnPNC] : []
  }
}

export default generateOperations
