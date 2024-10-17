import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../lib/exceptions/errorPaths"
import type Exception from "../../../types/Exception"
import type { Operation } from "../../../types/PncUpdateDataset"
import operationCourtCaseReference, { courtCaseSpecificOperations } from "./operationCourtCaseReference"
import { PncOperation } from "../../../types/PncOperation"

const errorPath = errorPaths.case.asn

const validateOperations = (operations: Operation[]): Exception | void => {
  const hasOperation = (pncOperation: PncOperation) => operations.some((operation) => operation.code === pncOperation)

  const operationsWithCourtCase: Operation[] = operations.filter((operation) =>
    courtCaseSpecificOperations.includes(operation.code)
  )

  if (
    hasOperation(PncOperation.PENALTY_HEARING) &&
    operationsWithCourtCase.some((operationWithCourtCase) =>
      [PncOperation.DISPOSAL_UPDATED, PncOperation.PENALTY_HEARING].includes(operationWithCourtCase.code)
    )
  ) {
    return { code: ExceptionCode.HO200109, path: errorPath }
  }

  const findClashingCourtCaseOperation = (operation: Operation) =>
    operationsWithCourtCase.find(
      (operationWithCourtCase) =>
        operationCourtCaseReference(operationWithCourtCase) == operationCourtCaseReference(operation)
    )

  const hasSameCourtCaseOperationWithSameCcr = operationsWithCourtCase.some((operation, index) => {
    const clashingCourtCaseOperation = findClashingCourtCaseOperation(operation)

    return (
      clashingCourtCaseOperation &&
      index !== operationsWithCourtCase.indexOf(clashingCourtCaseOperation) &&
      operation.code === clashingCourtCaseOperation.code
    )
  })

  if (hasSameCourtCaseOperationWithSameCcr) {
    return { code: ExceptionCode.HO200109, path: errorPath }
  }

  return undefined
}

export default validateOperations
