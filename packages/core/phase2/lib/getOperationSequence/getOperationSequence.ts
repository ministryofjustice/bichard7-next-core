import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import OperationsResult from "../../types/OperationsResult"
import { areAllResultsAlreadyPresentOnPnc } from "./areAllResultsAlreadyPresentOnPnc"
import checkNoSequenceConditions from "./checkNoSequenceConditions"
import { deriveOperationSequence } from "./deriveOperationSequence"
import sortOperations from "./sortOperations"
import validateOperationSequence from "./validateOperationSequence"

const getOperationSequence = (aho: AnnotatedHearingOutcome, resubmitted: boolean): OperationsResult => {
  const exceptions = checkNoSequenceConditions(aho)
  if (exceptions.length > 0) {
    return { exceptions }
  }

  const allResultsAlreadyOnPnc = areAllResultsAlreadyPresentOnPnc(aho)
  const remandCcrs = new Set<string>()
  const operationsResult = deriveOperationSequence(aho, resubmitted, allResultsAlreadyOnPnc, remandCcrs)
  if ("exceptions" in operationsResult) {
    return operationsResult
  }

  const { operations } = operationsResult
  const exception = validateOperationSequence(operations, remandCcrs)
  if (exception) {
    return { exceptions: [exception] }
  }

  const filteredOperations = allResultsAlreadyOnPnc
    ? operations.filter((operation) => operation.code === "NEWREM")
    : operations

  return { operations: sortOperations(filteredOperations) }
}

export default getOperationSequence
