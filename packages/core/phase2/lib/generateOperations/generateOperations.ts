import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { ResultClassHandler } from "./resultClassHandlers/ResultClassHandler"

import { PncOperation } from "../../../types/PncOperation"
import { type Operation } from "../../../types/PncUpdateDataset"
import ResultClass from "../../../types/ResultClass"
import isRecordableOffence from "../isRecordableOffence"
import isRecordableResult from "../isRecordableResult"
import deduplicateOperations from "./deduplicateOperations"
import filterDisposalsAddedInCourt from "./filterDisposalsAddedInCourt"
import { handleAdjournment } from "./resultClassHandlers/handleAdjournment"
import { handleAdjournmentPostJudgement } from "./resultClassHandlers/handleAdjournmentPostJudgement"
import { handleAdjournmentPreJudgement } from "./resultClassHandlers/handleAdjournmentPreJudgement"
import { handleAdjournmentWithJudgement } from "./resultClassHandlers/handleAdjournmentWithJudgement"
import { handleJudgementWithFinalResult } from "./resultClassHandlers/handleJudgementWithFinalResult"
import { handleSentence } from "./resultClassHandlers/handleSentence"
import sortOperations from "./sortOperations"

const resultClassHandlers: Record<ResultClass, ResultClassHandler> = {
  [ResultClass.ADJOURNMENT]: handleAdjournment,
  [ResultClass.ADJOURNMENT_PRE_JUDGEMENT]: handleAdjournmentPreJudgement,
  [ResultClass.ADJOURNMENT_WITH_JUDGEMENT]: handleAdjournmentWithJudgement,
  [ResultClass.ADJOURNMENT_POST_JUDGEMENT]: handleAdjournmentPostJudgement,
  [ResultClass.JUDGEMENT_WITH_FINAL_RESULT]: handleJudgementWithFinalResult,
  [ResultClass.SENTENCE]: handleSentence,
  [ResultClass.UNRESULTED]: () => []
}

export const generateOperationsFromOffenceResults = (
  aho: AnnotatedHearingOutcome,
  areAllResultsOnPnc: boolean,
  resubmitted: boolean
): Operation[] => {
  const operations = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    isRecordableOffence
  ).flatMap((offence) =>
    offence.Result.flatMap(
      (result) =>
        (isRecordableResult(result) &&
          result.ResultClass &&
          resultClassHandlers[result.ResultClass]?.({ aho, offence, result, resubmitted, areAllResultsOnPnc })) ||
        []
    )
  )

  return filterDisposalsAddedInCourt(operations)
}

const generateOperations = (
  aho: AnnotatedHearingOutcome,
  resubmitted: boolean,
  areAllResultsOnPnc: boolean
): Operation[] => {
  const operations = generateOperationsFromOffenceResults(aho, areAllResultsOnPnc, resubmitted)
  const deduplicatedOperations = deduplicateOperations(operations)

  const filteredOperations = areAllResultsOnPnc
    ? deduplicatedOperations.filter((operation) => operation.code === PncOperation.REMAND)
    : deduplicatedOperations

  return sortOperations(filteredOperations)
}

export default generateOperations
