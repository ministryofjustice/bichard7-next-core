import type Exception from "../../types/Exception"
import type { Operation } from "../../types/PncUpdateDataset"

type OperationsResult = { exceptions: Exception[] } | { operations: Operation[] }

export default OperationsResult
