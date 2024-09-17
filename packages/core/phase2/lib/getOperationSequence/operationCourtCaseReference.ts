import { PncOperation } from "../../../types/PncOperation"
import type { Operation } from "../../../types/PncUpdateDataset"

const operationCodes = [PncOperation.SENTENCE_DEFERRED, PncOperation.NORMAL_DISPOSAL, PncOperation.DISPOSAL_UPDATED]

const operationCourtCaseReference = (operation: Operation): string | undefined =>
  operationCodes.includes(operation.code as PncOperation) && operation.data && "courtCaseReference" in operation.data
    ? operation.data.courtCaseReference
    : undefined

export default operationCourtCaseReference
