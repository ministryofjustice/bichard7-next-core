import { ExceptionResult } from "../../../phase1/types/Exception"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { Operation } from "../../../types/PncUpdateDataset"
import { areAllResultsAlreadyPresentOnPnc } from "./areAllResultsAlreadyPresentOnPnc"
import checkNoSequenceConditions from "./checkNoSequenceConditions"
import { deriveOperationSequence } from "./deriveOperationSequence"
import sortOperations from "./sortOperations"
import validateOperationSequence from "./validateOperationSequence"

const getOperationSequence = (aho: AnnotatedHearingOutcome, resubmitted: boolean): ExceptionResult<Operation[]> => {
  const checkNoSequenceConditionsExceptions = checkNoSequenceConditions(aho)
  if (checkNoSequenceConditionsExceptions.length > 0) {
    return { value: [], exceptions: checkNoSequenceConditionsExceptions }
  }

  const { value: allResultsAlreadyOnPnc, exceptions } = areAllResultsAlreadyPresentOnPnc(aho)
  const remandCcrs = new Set<string>()
  const operationsResult = deriveOperationSequence(aho, resubmitted, allResultsAlreadyOnPnc, remandCcrs)
  if ("exceptions" in operationsResult) {
    return { value: [], exceptions: operationsResult.exceptions.concat(exceptions) }
  }

  const { operations } = operationsResult
  const exception = validateOperationSequence(operations, remandCcrs)
  if (exception) {
    return { value: [], exceptions: exceptions.concat(exception) }
  }

  const filteredOperations = allResultsAlreadyOnPnc
    ? operations.filter((operation) => operation.code === "NEWREM")
    : operations

  return { value: sortOperations(filteredOperations), exceptions }
}

export default getOperationSequence
