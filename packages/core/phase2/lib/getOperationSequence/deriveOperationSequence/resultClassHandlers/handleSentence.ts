import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../lib/exceptions/errorPaths"
import createOperation from "../../../createOperation"
import areAnyPncResults2007 from "../areAnyPncResults2007"
import createSubsequentVariationOperation from "../createSubsequentVariationOperation"
import type { ResultClassHandler } from "../deriveOperationSequence"

export const handleSentence: ResultClassHandler = ({
  aho,
  offence,
  resubmitted,
  allResultsAlreadyOnPnc,
  offenceIndex,
  resultIndex,
  result
}) => {
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const ccrId = offence?.CourtCaseReferenceNumber || undefined
  const operationData = ccrId ? { courtCaseReference: ccrId } : undefined

  if (fixedPenalty) {
    return { operations: [createOperation("PENHRG", operationData)], exceptions: [] }
  }

  if (!result.PNCAdjudicationExists) {
    if (!offence.AddedByTheCourt) {
      const exception = {
        code: ExceptionCode.HO200106,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      }
      return { operations: [], exceptions: [exception] }
    }

    return { operations: [], exceptions: [] }
  }

  if (!areAnyPncResults2007(aho, offence)) {
    return { operations: [createOperation("SENDEF", operationData)], exceptions: [] }
  }

  return createSubsequentVariationOperation(
    resubmitted,
    aho,
    ExceptionCode.HO200104,
    allResultsAlreadyOnPnc,
    offenceIndex,
    resultIndex,
    operationData
  )
}
