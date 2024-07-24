import type ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import type { OperationData } from "../../../../types/PncUpdateDataset"
import createOperation from "./createOperation"
import ExceptionsAndOperations from "./ExceptionsAndOperations"

const areAllPncResults2007 = (aho: AnnotatedHearingOutcome, courtCaseReference?: string) => {
  const ccr = courtCaseReference || aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  const matchingPncCase = aho.PncQuery?.courtCases?.find((courtCase) => courtCase.courtCaseReference === ccr)
  const allDisposals = matchingPncCase?.offences?.flatMap((offence) => offence.disposals ?? []) ?? []

  return allDisposals.length > 0 && allDisposals.every((disposal) => disposal.type === 2007)
}

const createSubsequentVariationOperation = (
  resubmitted: boolean,
  aho: AnnotatedHearingOutcome,
  exceptionCode: ExceptionCode,
  allResultsAlreadyOnPnc: boolean,
  offenceIndex: number,
  resultIndex: number,
  operationData: OperationData<"SUBVAR">
): ExceptionsAndOperations => {
  if (resubmitted) {
    return { operations: [createOperation("SUBVAR", operationData)], exceptions: [] }
  }

  if (areAllPncResults2007(aho, operationData?.courtCaseReference)) {
    return { operations: [createOperation("SUBVAR", operationData)], exceptions: [] }
  } else if (!allResultsAlreadyOnPnc) {
    const exception = { code: exceptionCode, path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass }
    return { operations: [], exceptions: [exception] }
  }

  return { operations: [], exceptions: [] }
}

export default createSubsequentVariationOperation
