import type ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { OperationData } from "../../../types/PncUpdateDataset"
import createOperation from "./createOperation"
import type ExceptionsAndOperations from "./ExceptionsAndOperations"
import { PncOperation } from "../../../types/PncOperation"
import areAllPncResults2007 from "../areAllPncResults2007"

const createSubsequentVariationOperation = (
  resubmitted: boolean,
  aho: AnnotatedHearingOutcome,
  exceptionCode: ExceptionCode | undefined,
  allResultsAlreadyOnPnc: boolean,
  offenceIndex: number,
  resultIndex: number,
  operationData: OperationData<PncOperation.DISPOSAL_UPDATED>
): ExceptionsAndOperations => {
  if (resubmitted) {
    return { operations: [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)], exceptions: [] }
  }

  if (areAllPncResults2007(aho, operationData?.courtCaseReference)) {
    return { operations: [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)], exceptions: [] }
  } else if (!allResultsAlreadyOnPnc) {
    if (exceptionCode) {
      // TODO: Remove when exceptionCode parameter is removed from this function
      const exception = { code: exceptionCode, path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass }
      return { operations: [], exceptions: [exception] }
    }
  }

  return { operations: [], exceptions: [] }
}

export default createSubsequentVariationOperation
