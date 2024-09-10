import type { Operation } from "../../../types/PncUpdateDataset"
import { PNCMessageType } from "../../types/operationCodes"

const operationCodes = [
  PNCMessageType.SENTENCE_DEFERRED,
  PNCMessageType.NORMAL_DISPOSAL,
  PNCMessageType.DISPOSAL_UPDATED,
  PNCMessageType.COMMITTED_SENTENCING,
  PNCMessageType.APPEALS_UPDATE
]

const operationCourtCaseReference = (operation: Operation): string | undefined =>
  operationCodes.includes(operation.code) && operation.data && "courtCaseReference" in operation.data
    ? operation.data.courtCaseReference
    : undefined

export default operationCourtCaseReference
