import type { Operation } from "../types/PncUpdateDataset"

const updateOperationSequenceForResultsAlreadyPresent = (
  operations: Operation[],
  allResultsAlreadyOnPnc: boolean
): Operation[] => (allResultsAlreadyOnPnc ? operations.filter((operation) => operation.code === "NEWREM") : operations)

export default updateOperationSequenceForResultsAlreadyPresent
