import Exception from "../../../../phase1/types/Exception"
import type { Operation } from "../../../../types/PncUpdateDataset"
import generateIncompatibleOperationExceptions from "./generateIncompatibleOperationExceptions"

const validateOperationSequence = (operations: Operation[], remandCcrs: Set<string>): Exception | void =>
  generateIncompatibleOperationExceptions(operations, remandCcrs)

export default validateOperationSequence
