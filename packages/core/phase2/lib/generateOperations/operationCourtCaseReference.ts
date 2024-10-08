import { PncOperation } from "../../../types/PncOperation"
import type { Operation } from "../../../types/PncUpdateDataset"

export const courtCaseSpecificOperations = [
  PncOperation.SENTENCE_DEFERRED,
  PncOperation.NORMAL_DISPOSAL,
  PncOperation.DISPOSAL_UPDATED
]

const operationCourtCaseReference = (operation: Operation): string | undefined =>
  courtCaseSpecificOperations.includes(operation.code) && operation.data && "courtCaseReference" in operation.data
    ? operation.data.courtCaseReference
    : undefined

export default operationCourtCaseReference
