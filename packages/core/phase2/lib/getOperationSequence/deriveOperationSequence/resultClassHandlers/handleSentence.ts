import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../lib/exceptions/errorPaths"
import addNewOperationToOperationSetIfNotPresent from "../../../addNewOperationToOperationSetIfNotPresent"
import addSubsequentVariationOperations from "../addSubsequentVariationOperations"
import areAnyPncResults2007 from "../areAnyPncResults2007"
import type { ResultClassHandler } from "../deriveOperationSequence"

export const handleSentence: ResultClassHandler = ({
  ccrId,
  operations,
  aho,
  offence,
  resubmitted,
  allResultsAlreadyOnPnc,
  offenceIndex,
  resultIndex,
  result
}) => {
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber

  if (fixedPenalty) {
    addNewOperationToOperationSetIfNotPresent("PENHRG", ccrId ? { courtCaseReference: ccrId } : undefined, operations)
    return
  }

  if (!result.PNCAdjudicationExists) {
    if (!offence.AddedByTheCourt) {
      return { code: ExceptionCode.HO200106, path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass }
    }

    return
  }

  if (!areAnyPncResults2007(aho, offence)) {
    addNewOperationToOperationSetIfNotPresent("SENDEF", ccrId ? { courtCaseReference: ccrId } : undefined, operations)
    return
  }

  return addSubsequentVariationOperations(
    resubmitted,
    operations,
    aho,
    ExceptionCode.HO200104,
    allResultsAlreadyOnPnc,
    offenceIndex,
    resultIndex,
    ccrId ? { courtCaseReference: ccrId } : undefined
  )
}