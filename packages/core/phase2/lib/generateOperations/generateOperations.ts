import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { type Operation } from "../../../types/PncUpdateDataset"
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
  [ResultClass.UNRESULTED]: () => []
}

const generateOperationsFromOffences = (
  aho: AnnotatedHearingOutcome,
  allResultsOnPnc: boolean,
  resubmitted: boolean
): Operation[] => {
  const operations = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    isRecordableOffence
  ).flatMap((offence) =>
    offence.Result.flatMap(
      (result) =>
        (isRecordableResult(result) &&
          result.ResultClass &&
          resultClassHandlers[result.ResultClass]?.({ aho, offence, result, resubmitted, allResultsOnPnc })) ||
        []
    )
  )

  return filterDisposalsAddedInCourt(operations)
}

const generateOperations = (aho: AnnotatedHearingOutcome, resubmitted: boolean): ExceptionsAndOperations => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  if (offences.filter(isRecordableOffence).length === 0) {
    return { exceptions: [], operations: [] }
  }

  const allResultsOnPnc = areAllResultsOnPnc(aho)
  const operations = generateOperationsFromOffences(aho, allResultsOnPnc, resubmitted)
  const remandCcrs = extractRemandCcrs(operations, false)
  const deduplicatedOperations = deduplicateOperations(operations)
  const validateOperationException = validateOperations(deduplicatedOperations, remandCcrs)
  if (validateOperationException) {
    return { operations: [], exceptions: [validateOperationException] }
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
