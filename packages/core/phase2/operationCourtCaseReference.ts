import type { Operation } from "../types/PncUpdateDataset"

const operationCourtCaseReference = (operation: Operation): string | undefined => {
  const operationCode = operation.code
  if (operationCode === "SENDEF") {
    return operation.data?.courtCaseReference
  }

  if (operationCode === "DISARR") {
    return operation.data?.courtCaseReference
  }

  if (operationCode === "SUBVAR") {
    return operation.data?.courtCaseReference
  }

  if (operationCode === "COMSEN") {
    return operation.data?.courtCaseReference
  }

  if (operationCode === "APPHRD") {
    return operation.data?.courtCaseReference
  }

  return
}

export default operationCourtCaseReference
