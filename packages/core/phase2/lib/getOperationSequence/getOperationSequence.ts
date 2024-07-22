import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { ExceptionResult } from "../../../types/Exception"
import type { Operation } from "../../../types/PncUpdateDataset"
import { areAllResultsAlreadyPresentOnPnc } from "./areAllResultsAlreadyPresentOnPnc"
import checkNoSequenceConditions from "./checkNoSequenceConditions"
import { deriveOperationSequence } from "./deriveOperationSequence"
import sortOperations from "./sortOperations"

const getOperationSequence = (aho: AnnotatedHearingOutcome, resubmitted: boolean): ExceptionResult<Operation[]> => {
  const checkNoSequenceConditionsExceptions = checkNoSequenceConditions(aho)
  if (checkNoSequenceConditionsExceptions.length > 0) {
    return { value: [], exceptions: checkNoSequenceConditionsExceptions }
  }

  const { value: allResultsAlreadyOnPnc, exceptions } = areAllResultsAlreadyPresentOnPnc(aho)
  const operationsResult = deriveOperationSequence(aho, resubmitted, allResultsAlreadyOnPnc)
  if ("exceptions" in operationsResult) {
    return { value: [], exceptions: operationsResult.exceptions.concat(exceptions) }
  }

  const { operations } = operationsResult
  const filteredOperations = allResultsAlreadyOnPnc
    ? operations.filter((operation) => operation.code === "NEWREM")
    : operations

  return { value: sortOperations(filteredOperations), exceptions }
}

export default getOperationSequence
