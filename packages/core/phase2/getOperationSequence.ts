import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { Operation } from "../types/PncUpdateDataset.ts"
import areAllResultsAlreadyPresentOnPnc from "./areAllResultsAlreadyPresentOnPnc"
import checkNoSequenceConditions from "./checkNoSequenceConditions"
import { deriveOperationSequence } from "./lib/deriveOperationSequence"
import sortOperations from "./sortOperations"
import updateOperationSequenceForResultsAlreadyPresent from "./updateOperationSequenceForResultsAlreadyPresent"
import validateOperationSequence from "./validateOperationSequence"

const getOperationSequence = (aho: AnnotatedHearingOutcome, resubmitted: boolean): Operation[] => {
  checkNoSequenceConditions(aho)
  if (aho.HasError) {
    return []
  }

  const allResultsAlreadyOnPNC = areAllResultsAlreadyPresentOnPnc(aho)
  const remandCcrs = new Set<string>()
  const operations = deriveOperationSequence(aho, resubmitted, allResultsAlreadyOnPNC, remandCcrs)
  validateOperationSequence(operations, allResultsAlreadyOnPNC, aho, remandCcrs)
  const filteredOperations = updateOperationSequenceForResultsAlreadyPresent(operations, allResultsAlreadyOnPNC)

  return sortOperations(filteredOperations)
}

export default getOperationSequence
