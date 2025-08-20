import type Exception from "@moj-bichard7/common/types/Exception"
import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

type OperationsResult = { exceptions: Exception[] } | { operations: Operation[] }

export default OperationsResult
