import type Exception from "../../types/Exception"
import type { Operation } from "../../types/PncUpdateDataset"

type OperationsResult = { operations: Operation[] } | { exceptions: Exception[] }

export default OperationsResult
