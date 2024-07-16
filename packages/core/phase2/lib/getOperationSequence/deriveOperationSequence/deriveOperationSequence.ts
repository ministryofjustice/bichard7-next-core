import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../phase1/lib/errorPaths"
import type Exception from "../../../../phase1/types/Exception"
import ResultClass from "../../../../phase1/types/ResultClass"
import type { AnnotatedHearingOutcome, Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import type { Operation } from "../../../../types/PncUpdateDataset"
import type OperationsResult from "../../../types/OperationsResult"
import isRecordableOffence from "../../isRecordableOffence"
import isRecordableResult from "../../isRecordableResult"
import addOaacDisarrOperationsIfNecessary from "./addOaacDisarrOperationsIfNecessary"
import { handleAdjournment } from "./handleAdjournment"
import { handleAdjournmentPostJudgement } from "./handleAdjournmentPostJudgement"
import { handleAdjournmentPreJudgement } from "./handleAdjournmentPreJudgement"
import { handleAdjournmentWithJudgement } from "./handleAdjournmentWithJudgement"
import { handleAppealOutcome } from "./handleAppealOutcome"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"
import { handleSentence } from "./handleSentence"

export type ResultClassHandlerParams = {
  aho: AnnotatedHearingOutcome
  offence: Offence
  offenceIndex: number
  result: Result
  resultIndex: number
  fixedPenalty: boolean
  ccrId: string | undefined
  operations: Operation[]
  adjudicationExists: boolean | undefined
  resubmitted: boolean
  allResultsAlreadyOnPnc: boolean
  pncDisposalCode: number | undefined
  contains2007Result: boolean
  oAacDisarrOperations: Operation[]
  remandCcrs: Set<string>
  adjPreJudgementRemandCcrs: Set<string | undefined>
}
export type ResultClassHandler = (params: ResultClassHandlerParams) => Exception | void

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
  allResultsAlreadyOnPnc: boolean,
  remandCcrs: Set<string>
): OperationsResult => {
  const exceptions: Exception[] = []
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  if (offences.filter(isRecordableOffence).length === 0) {
    exceptions.push({ code: ExceptionCode.HO200121, path: errorPaths.case.asn })
  }

  const operations: Operation[] = []
  const oAacDisarrOperations: Operation[] = []
  const adjPreJudgementRemandCcrs = new Set<string | undefined>()
  let recordableResultFound = false

  offences.forEach((offence, offenceIndex) => {
    if (isRecordableOffence(offence)) {
      const contains2007Result = !!offence?.Result.some((r) => r.PNCDisposalType === 2007)

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
            fixedPenalty: !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber,
            ccrId: offence?.CourtCaseReferenceNumber || undefined,
            operations,
            adjudicationExists: result.PNCAdjudicationExists,
            resubmitted,
            allResultsAlreadyOnPnc,
            pncDisposalCode: result.PNCDisposalType,
            contains2007Result,
            oAacDisarrOperations,
            remandCcrs,
            adjPreJudgementRemandCcrs
          })

          if (exception) {
            exceptions.push(exception)
          }
        }
      })
    }
  })

  if (operations.length === 0 && !recordableResultFound && exceptions.length === 0) {
    exceptions.push({ code: ExceptionCode.HO200118, path: errorPaths.case.asn })
  } else if (operations.length > 0 && oAacDisarrOperations.length > 0 && adjPreJudgementRemandCcrs.size > 0) {
    addOaacDisarrOperationsIfNecessary(operations, oAacDisarrOperations, adjPreJudgementRemandCcrs)
  }

  return exceptions.length > 0 ? { exceptions } : { operations }
}

export default deriveOperationSequence
