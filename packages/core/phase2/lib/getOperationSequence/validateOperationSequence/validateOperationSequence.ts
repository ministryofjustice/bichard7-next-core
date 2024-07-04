import addExceptionsToAho from "../../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../../phase1/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import type { Operation } from "../../../../types/PncUpdateDataset"
import incompatibleOperationCode from "./incompatibleOperationCode"
import incompatibleOperationExceptionCode from "./incompatibleOperationExceptionCode"

const validateOperationSequence = (
  operations: Operation[],
  allResultsAlreadyOnPnc: boolean,
  aho: AnnotatedHearingOutcome,
  remandCcrs: Set<string>
): boolean => {
  if (operations.length === 0) {
    return allResultsAlreadyOnPnc
  }

  const incompatibleCodes = incompatibleOperationCode(operations, remandCcrs)
  if (incompatibleCodes) {
    const errorCode = incompatibleOperationExceptionCode(incompatibleCodes)
    if (errorCode) {
      addExceptionsToAho(aho, errorCode, errorPaths.case.asn)
    }

    return false
  }

  return true
}

export default validateOperationSequence
