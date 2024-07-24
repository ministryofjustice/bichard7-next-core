import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../types/Exception"
import type { Operation } from "../../../../types/PncUpdateDataset"
import ResultClass from "../../../../types/ResultClass"
import type OperationsResult from "../../../types/OperationsResult"
import isRecordableOffence from "../../isRecordableOffence"
import isRecordableResult from "../../isRecordableResult"
import validateOperations from "../validateOperations"
import deduplicateOperations from "./deduplicateOperations"
import extractRemandCcrs from "./extractRemandCcrs"
import filterDisposalsAddedInCourt from "./filterDisposalsAddedInCourt"
import { handleAdjournment } from "./resultClassHandlers/handleAdjournment"
import { handleAdjournmentPostJudgement } from "./resultClassHandlers/handleAdjournmentPostJudgement"
import { handleAdjournmentPreJudgement } from "./resultClassHandlers/handleAdjournmentPreJudgement"
import { handleAdjournmentWithJudgement } from "./resultClassHandlers/handleAdjournmentWithJudgement"
import { handleAppealOutcome } from "./resultClassHandlers/handleAppealOutcome"
import { handleJudgementWithFinalResult } from "./resultClassHandlers/handleJudgementWithFinalResult"
import { handleSentence } from "./resultClassHandlers/handleSentence"
import type { ResultClassHandler } from "./resultClassHandlers/ResultClassHandler"

const resultClassHandlers: Record<ResultClass, ResultClassHandler> = {
  [ResultClass.ADJOURNMENT]: handleAdjournment,
  [ResultClass.ADJOURNMENT_PRE_JUDGEMENT]: handleAdjournmentPreJudgement,
  [ResultClass.ADJOURNMENT_WITH_JUDGEMENT]: handleAdjournmentWithJudgement,
  [ResultClass.ADJOURNMENT_POST_JUDGEMENT]: handleAdjournmentPostJudgement,
  [ResultClass.JUDGEMENT_WITH_FINAL_RESULT]: handleJudgementWithFinalResult,
  [ResultClass.SENTENCE]: handleSentence,
  [ResultClass.APPEAL_OUTCOME]: handleAppealOutcome,
  [ResultClass.UNRESULTED]: () => ({ operations: [], exceptions: [] })
}

const generateOperations = (
  aho: AnnotatedHearingOutcome,
  resubmitted: boolean,
  allResultsAlreadyOnPnc: boolean
): OperationsResult => {
  const exceptions: Exception[] = []
  const allOperations: Operation[] = []
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  let recordableResultFound = false

  if (offences.filter(isRecordableOffence).length === 0) {
    return { exceptions: [{ code: ExceptionCode.HO200121, path: errorPaths.case.asn }], operations: [] }
  }

  offences.forEach((offence, offenceIndex) => {
    if (!isRecordableOffence(offence)) {
      return
    }

    offence.Result.forEach((result, resultIndex) => {
      if (!isRecordableResult(result)) {
        return
      }

      recordableResultFound = true

      if (result.ResultClass) {
        const handlerResult = resultClassHandlers[result.ResultClass]?.({
          aho,
          offenceIndex,
          offence,
          resultIndex,
          result,
          resubmitted,
          allResultsAlreadyOnPnc
        })

        exceptions.push(...handlerResult.exceptions)
        allOperations.push(...handlerResult.operations)
      }
    })
  })

  const operations = filterDisposalsAddedInCourt(allOperations)
  if (operations.length === 0 && !recordableResultFound && exceptions.length === 0) {
    exceptions.push({ code: ExceptionCode.HO200118, path: errorPaths.case.asn })
  }

  const remandCcrs = extractRemandCcrs(operations, false)
  const deduplicatedOperations = deduplicateOperations(operations)
  const exception = validateOperations(deduplicatedOperations, remandCcrs)
  if (exception) {
    exceptions.push(exception)
  }

  return exceptions.length > 0 ? { exceptions } : { operations: deduplicatedOperations }
}

export default generateOperations
