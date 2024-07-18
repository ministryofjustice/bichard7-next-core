import type ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../lib/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../types/Exception"
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
): Exception | void => {
  if (resubmitted) {
    addNewOperationToOperationSetIfNotPresent("SUBVAR", operationData, operations)
    return
  }

  if (areAllPncResults2007(aho, operationData?.courtCaseReference)) {
    addNewOperationToOperationSetIfNotPresent("SUBVAR", operationData, operations)
  } else if (!allResultsAlreadyOnPnc) {
    return { code: exceptionCode, path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass }
  }
}

export default addSubsequentVariationOperations
