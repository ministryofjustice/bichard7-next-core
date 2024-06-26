import addExceptionsToAho from "../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../phase1/lib/errorPaths"
import DocumentType from "../../../types/DocumentType"
import { ExceptionCode } from "../../../types/ExceptionCode"
import addNewOperationToOperationSetIfNotPresent from "../../addNewOperationToOperationSetIfNotPresent"
import addSubsequentVariationOperations from "./addSubsequentVariationOperations"
import areAnyPncResults2007 from "./areAnyPncResults2007"
import type { ResultClassHandler } from "./deriveOperationSequence"

export const handleSentence: ResultClassHandler = ({
  fixedPenalty,
  ccrId,
  operations,
  adjudicationExists,
  aho,
  offence,
  resubmitted,
  allResultsAlreadyOnPnc,
  offenceIndex,
  resultIndex
}) => {
  const docType = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.DocumentType

  if (fixedPenalty) {
    addNewOperationToOperationSetIfNotPresent("PENHRG", ccrId ? { courtCaseReference: ccrId } : undefined, operations)
    return
  }

  if (!adjudicationExists) {
    if (!offence.AddedByTheCourt) {
      addExceptionsToAho(aho, ExceptionCode.HO200106, errorPaths.offence(offenceIndex).result(resultIndex).resultClass)
    }

    return
  }

  if (docType === DocumentType.CommittalRecordSheet) {
    //TODO: Remove this once we've confirmed we don't handle committal record sheets
    addNewOperationToOperationSetIfNotPresent("COMSEN", ccrId ? { courtCaseReference: ccrId } : undefined, operations)
  } else if (docType === DocumentType.SpiResult) {
    if (!areAnyPncResults2007(aho, offence)) {
      addNewOperationToOperationSetIfNotPresent("SENDEF", ccrId ? { courtCaseReference: ccrId } : undefined, operations)
    } else {
      addSubsequentVariationOperations(
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
  }
}
