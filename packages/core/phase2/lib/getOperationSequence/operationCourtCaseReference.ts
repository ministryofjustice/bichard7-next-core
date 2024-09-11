import { PncOperation } from "../../../types/PncOperation"
import type { Operation } from "../../../types/PncUpdateDataset"

const operationCodes = ["SENDEF", "DISARR", "SUBVAR", "COMSEN", PncOperation.APPEALS_UPDATE]

const operationCourtCaseReference = (operation: Operation): string | undefined =>
  operationCodes.includes(operation.code) && operation.data && "courtCaseReference" in operation.data
    ? operation.data.courtCaseReference
    : undefined

export default operationCourtCaseReference
