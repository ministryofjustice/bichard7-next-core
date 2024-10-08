import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import isEqual from "lodash.isequal"
import errorPaths from "../../../lib/exceptions/errorPaths"
import type Exception from "../../../types/Exception"
import type { Operation } from "../../../types/PncUpdateDataset"
import operationCourtCaseReference, { courtCaseSpecificOperations } from "./operationCourtCaseReference"
import { PncOperation } from "../../../types/PncOperation"

const errorPath = errorPaths.case.asn

const validateOperations = (operations: Operation[], remandCcrs: Set<string>): Exception | void => {
  const hasOperation = (pncOperation: PncOperation) => operations.some((operation) => operation.code === pncOperation)

  if (hasOperation(PncOperation.PENALTY_HEARING) && hasOperation(PncOperation.SENTENCE_DEFERRED)) {
    return { code: ExceptionCode.HO200114, path: errorPath }
  }

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

  if (
    hasOperation(PncOperation.PENALTY_HEARING) &&
    operationsWithCourtCase.some(
      (operationWithCourtCase) => operationWithCourtCase.code === PncOperation.NORMAL_DISPOSAL
    )
  ) {
    return { code: ExceptionCode.HO200115, path: errorPath }
  }

  const hasNewRemandAndSentencing = operations.some((operation) => {
    const courtCaseReference = operationCourtCaseReference(operation)
    const remandCcrsContainCourtCaseReference = !!courtCaseReference && remandCcrs.has(courtCaseReference)

    return (
      PncOperation.SENTENCE_DEFERRED === operation.code &&
      ((hasOperation(PncOperation.REMAND) && remandCcrs.size === 0) || remandCcrsContainCourtCaseReference)
    )
  })

  if (hasNewRemandAndSentencing) {
    return { code: ExceptionCode.HO200113, path: errorPath }
  }

  const findClashingCourtCaseOperation = (operation: Operation) =>
    operationsWithCourtCase.find(
      (operationWithCourtCase) =>
        operationCourtCaseReference(operationWithCourtCase) == operationCourtCaseReference(operation)
    )

  const hasClashingCourtCaseOperations = (clashingCourtCaseOperations: [PncOperation, PncOperation]) =>
    operationsWithCourtCase.some((operation) => {
      const clashingCourtCaseOperation = findClashingCourtCaseOperation(operation)

      return isEqual([operation.code, clashingCourtCaseOperation?.code].sort(), clashingCourtCaseOperations)
    })

  if (hasClashingCourtCaseOperations([PncOperation.NORMAL_DISPOSAL, PncOperation.SENTENCE_DEFERRED])) {
    return { code: ExceptionCode.HO200112, path: errorPath }
  }

  if (hasClashingCourtCaseOperations([PncOperation.NORMAL_DISPOSAL, PncOperation.DISPOSAL_UPDATED])) {
    return { code: ExceptionCode.HO200115, path: errorPath }
  }

  if (hasClashingCourtCaseOperations([PncOperation.SENTENCE_DEFERRED, PncOperation.DISPOSAL_UPDATED])) {
    return { code: ExceptionCode.HO200114, path: errorPath }
  }

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
