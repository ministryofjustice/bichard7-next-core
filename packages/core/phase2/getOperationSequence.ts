import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { Operation, PncUpdateDataset } from "../types/PncUpdateDataset.ts"
import areAllResultsAlreadyPresentOnPnc from "./areAllResultsAlreadyPresentOnPnc"
import checkNoSequenceConditions from "./checkNoSequenceConditions"
import { deriveOperationSequence } from "./lib/deriveOperationSequence"
import sortOperations from "./sortOperations"
import updateOperationSequenceForResultsAlreadyPresent from "./updateOperationSequenceForResultsAlreadyPresent"
import validateOperationSequence from "./validateOperationSequence"

const getOperationSequence = (
  incomingMessage: AnnotatedHearingOutcome | PncUpdateDataset,
  resubmitted: boolean
): Operation[] => {
  checkNoSequenceConditions(incomingMessage)

  let sortedOperations: Operation[] = []
  if (!incomingMessage.HasError) {
    const allResultsAlreadyOnPNC = areAllResultsAlreadyPresentOnPnc(incomingMessage)
    const remandCcrs: Set<string> = new Set<string>()
    const operations = deriveOperationSequence(incomingMessage, resubmitted, allResultsAlreadyOnPNC, remandCcrs)

    validateOperationSequence(operations, allResultsAlreadyOnPNC, incomingMessage, remandCcrs)
    const filteredOperations = updateOperationSequenceForResultsAlreadyPresent(operations, allResultsAlreadyOnPNC)

    sortedOperations = sortOperations(filteredOperations)
  }

  return sortedOperations
}

export default getOperationSequence
