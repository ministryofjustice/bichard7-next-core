import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import OperationsResult from "../../types/OperationsResult"
import { areAllResultsAlreadyPresentOnPnc } from "./areAllResultsAlreadyPresentOnPnc"
import checkNoSequenceConditions from "./checkNoSequenceConditions"
import { deriveOperationSequence } from "./deriveOperationSequence"
import generateIncompatibleOperationExceptions from "./generateIncompatibleOperationExceptions"
import sortOperations from "./sortOperations"
import updateOperationSequenceForResultsAlreadyPresent from "./updateOperationSequenceForResultsAlreadyPresent"

const getOperationSequence = (aho: AnnotatedHearingOutcome, resubmitted: boolean): OperationsResult => {
  const exceptions = checkNoSequenceConditions(aho)
  if (exceptions.length > 0) {
    return { exceptions }
  }

  const allResultsAlreadyOnPNC = areAllResultsAlreadyPresentOnPnc(aho)
  const remandCcrs = new Set<string>()
  const operationsResult = deriveOperationSequence(aho, resubmitted, allResultsAlreadyOnPNC, remandCcrs)
  if ("exceptions" in operationsResult) {
    return operationsResult
  }

  const { operations } = operationsResult
  const exception = generateIncompatibleOperationExceptions(operations, remandCcrs)
  if (exception) {
    return { exceptions: [exception] }
  }

  const filteredOperations = updateOperationSequenceForResultsAlreadyPresent(operations, allResultsAlreadyOnPNC)

  return { operations: sortOperations(filteredOperations) }
}

export default getOperationSequence
