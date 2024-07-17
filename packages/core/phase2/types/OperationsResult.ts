import type Exception from "../../phase1/types/Exception"
import type { Operation } from "../../types/PncUpdateDataset"

type OperationsResult = { operations: Operation[] } | { exceptions: Exception[] }

export default OperationsResult
