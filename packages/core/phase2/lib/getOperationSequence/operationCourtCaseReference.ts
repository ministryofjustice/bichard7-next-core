import type { Operation } from "../../../types/PncUpdateDataset"
import { PncOperation } from "../../../types/PncOperation"

const operationCodes = [
  PncOperation.SENTENCE_DEFERRED,
  PncOperation.NORMAL_DISPOSAL,
  PncOperation.DISPOSAL_UPDATED,
  PncOperation.COMMITTED_SENTENCING,
  PncOperation.APPEALS_UPDATE
]

const operationCourtCaseReference = (operation: Operation): string | undefined =>
  operationCodes.includes(operation.code) && operation.data && "courtCaseReference" in operation.data
    ? operation.data.courtCaseReference
    : undefined

export default operationCourtCaseReference
