import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import isRecordableOffence from "../lib/isRecordableOffence"
import isRecordableResult from "../lib/isRecordableResult"
import ResultClass from "../../types/ResultClass"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber

  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  if (!fixedPenalty) {
    offences.forEach((offence, offenceIndex) => {
      const results = offence.Result
      if (!isRecordableOffence(offence)) {
        return
      }

      results.forEach((result, resultIndex) => {
        if (!isRecordableResult(result)) {
          return
        }

        if (result.ResultClass !== ResultClass.ADJOURNMENT_PRE_JUDGEMENT) {
          return
        }

        if (result.PNCAdjudicationExists) {
          const exception = {
            code: ExceptionCode.HO200100,
            path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
          }
          exceptions.push(exception)
        }
      })
    })
  }

  return exceptions
}

export default generator
