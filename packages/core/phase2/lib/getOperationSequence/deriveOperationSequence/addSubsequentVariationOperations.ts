import addExceptionsToAho from "../../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../../phase1/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import type { ExceptionCode } from "../../../../types/ExceptionCode"
import type { Operation, OperationData } from "../../../../types/PncUpdateDataset"
import addNewOperationToOperationSetIfNotPresent from "../../addNewOperationToOperationSetIfNotPresent"

const areAllPncResults2007 = (aho: AnnotatedHearingOutcome, courtCaseReference?: string) => {
  const ccr = courtCaseReference || aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  const matchingPncCase = aho.PncQuery?.courtCases?.find((courtCase) => courtCase.courtCaseReference === ccr)
  const allDisposals = matchingPncCase?.offences?.flatMap((offence) => offence.disposals ?? []) ?? []

  return allDisposals.length > 0 && allDisposals.every((disposal) => disposal.type === 2007)
}

const addSubsequentVariationOperations = (
  resubmitted: boolean,
  operations: Operation[],
  aho: AnnotatedHearingOutcome,
  exceptionCode: ExceptionCode,
  allResultsAlreadyOnPnc: boolean,
  offenceIndex: number,
  resultIndex: number,
  operationData: OperationData<"SUBVAR">
) => {
  if (resubmitted) {
    addNewOperationToOperationSetIfNotPresent("SUBVAR", operationData, operations)
    return
  }

  if (areAllPncResults2007(aho, operationData?.courtCaseReference)) {
    addNewOperationToOperationSetIfNotPresent("SUBVAR", operationData, operations)
  } else if (!allResultsAlreadyOnPnc) {
    addExceptionsToAho(aho, exceptionCode, errorPaths.offence(offenceIndex).result(resultIndex).resultClass)
  }
}

export default addSubsequentVariationOperations
