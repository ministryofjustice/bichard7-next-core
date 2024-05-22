import type { Operation } from "../types/PncUpdateDataset"

const updateOperationSequenceForResultsAlreadyPresent = (
  operations: Operation[],
  allResultsAlreadyOnPnc: boolean
): Operation[] => {
  if (allResultsAlreadyOnPnc) {
    return operations.filter((operation) => operation.code === "NEWREM")
  }
  return operations
}

export default updateOperationSequenceForResultsAlreadyPresent
