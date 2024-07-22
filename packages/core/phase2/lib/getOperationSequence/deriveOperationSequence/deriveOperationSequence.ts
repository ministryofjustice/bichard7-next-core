import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome, Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../types/Exception"
import type { Operation } from "../../../../types/PncUpdateDataset"
import ResultClass from "../../../../types/ResultClass"
import type OperationsResult from "../../../types/OperationsResult"
import isRecordableOffence from "../../isRecordableOffence"
import isRecordableResult from "../../isRecordableResult"
import validateOperationSequence from "../validateOperationSequence"
import addOaacDisarrOperationsIfNecessary from "./addOaacDisarrOperationsIfNecessary"
import deduplicateOperations from "./deduplicateOperations"
import { handleAdjournment } from "./resultClassHandlers/handleAdjournment"
import { handleAdjournmentPostJudgement } from "./resultClassHandlers/handleAdjournmentPostJudgement"
import { handleAdjournmentPreJudgement } from "./resultClassHandlers/handleAdjournmentPreJudgement"
import { handleAdjournmentWithJudgement } from "./resultClassHandlers/handleAdjournmentWithJudgement"
import { handleAppealOutcome } from "./resultClassHandlers/handleAppealOutcome"
import { handleJudgementWithFinalResult } from "./resultClassHandlers/handleJudgementWithFinalResult"
import { handleSentence } from "./resultClassHandlers/handleSentence"

export type ResultClassHandlerParams = {
  aho: AnnotatedHearingOutcome
  offence: Offence
  offenceIndex: number
  result: Result
  resultIndex: number
  operations: Operation[]
  resubmitted: boolean
  allResultsAlreadyOnPnc: boolean
  oAacDisarrOperations: Operation[]
}
export type ResultClassHandler = (params: ResultClassHandlerParams) => Exception | void

const extractNewremCcrs = <T extends boolean, K extends T extends false ? string : string | undefined>(
  operations: Operation[],
  isAdjPreJudgement: T
): Set<K> =>
  operations
    .filter((op) => op.code === "NEWREM")
    .reduce((acc, op) => {
      if ((!isAdjPreJudgement && op.data?.courtCaseReference) || op.data?.isAdjournmentPreJudgement) {
        acc.add(op.data?.courtCaseReference as K)
      }

      return acc
    }, new Set<K>())

const resultClassHandlers: Record<ResultClass, ResultClassHandler | undefined> = {
  [ResultClass.ADJOURNMENT]: handleAdjournment,
  [ResultClass.ADJOURNMENT_PRE_JUDGEMENT]: handleAdjournmentPreJudgement,
  [ResultClass.ADJOURNMENT_WITH_JUDGEMENT]: handleAdjournmentWithJudgement,
  [ResultClass.ADJOURNMENT_POST_JUDGEMENT]: handleAdjournmentPostJudgement,
  [ResultClass.JUDGEMENT_WITH_FINAL_RESULT]: handleJudgementWithFinalResult,
  [ResultClass.SENTENCE]: handleSentence,
  [ResultClass.APPEAL_OUTCOME]: handleAppealOutcome,
  [ResultClass.UNRESULTED]: undefined
}

const deriveOperationSequence = (
  aho: AnnotatedHearingOutcome,
  resubmitted: boolean,
  allResultsAlreadyOnPnc: boolean
): OperationsResult => {
  const exceptions: Exception[] = []
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  if (offences.filter(isRecordableOffence).length === 0) {
    exceptions.push({ code: ExceptionCode.HO200121, path: errorPaths.case.asn })
  }

  const operations: Operation[] = []
  const oAacDisarrOperations: Operation[] = []
  let recordableResultFound = false

  offences.forEach((offence, offenceIndex) => {
    if (isRecordableOffence(offence)) {
      offence.Result.forEach((result, resultIndex) => {
        if (!isRecordableResult(result)) {
          return
        }

        recordableResultFound = true

        if (result.ResultClass) {
          const exception = resultClassHandlers[result.ResultClass]?.({
            aho,
            offenceIndex,
            offence,
            resultIndex,
            result,
            operations,
            resubmitted,
            allResultsAlreadyOnPnc,
            oAacDisarrOperations
          })

          if (exception) {
            exceptions.push(exception)
          }
        }
      })
    }
  })

  const adjPreJudgementRemandCcrs = extractNewremCcrs(operations, true)

  if (operations.length === 0 && !recordableResultFound && exceptions.length === 0) {
    exceptions.push({ code: ExceptionCode.HO200118, path: errorPaths.case.asn })
  } else if (operations.length > 0 && oAacDisarrOperations.length > 0 && adjPreJudgementRemandCcrs.size > 0) {
    addOaacDisarrOperationsIfNecessary(operations, oAacDisarrOperations, adjPreJudgementRemandCcrs)
  }

  const remandCcrs = extractNewremCcrs(operations, false)
  const deduplicatedOperations = deduplicateOperations(operations)
  const exception = validateOperationSequence(deduplicatedOperations, remandCcrs)
  if (exception) {
    exceptions.push(exception)
  }

  return exceptions.length > 0 ? { exceptions } : { operations: deduplicatedOperations }
}

export default deriveOperationSequence
