import type { Operation } from "../types/PncUpdateDataset"

const operationCodes = ["SENDEF", "DISARR", "SUBVAR", "COMSEN", "APPHRD"]

const operationCourtCaseReference = (operation: Operation): string | undefined =>
  operationCodes.includes(operation.code) && operation.data && "courtCaseReference" in operation.data
    ? operation.data.courtCaseReference
    : undefined

export default operationCourtCaseReference
