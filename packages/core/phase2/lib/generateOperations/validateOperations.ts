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

  if (hasOperation(PncOperation.REMAND) && remandCcrs.size === 0 && hasOperation(PncOperation.SENTENCE_DEFERRED)) {
    return { code: ExceptionCode.HO200113, path: errorPath }
  }

  const operationsWithCourtCase2: Operation[] = operations.filter((operation) =>
    courtCaseSpecificOperations.includes(operation.code)
  )

  if (hasOperation(PncOperation.PENALTY_HEARING) && operationsWithCourtCase2.length > 0) {
    if (
      operationsWithCourtCase2.some((courtCaseSpecificOperation) =>
        [PncOperation.DISPOSAL_UPDATED, PncOperation.PENALTY_HEARING].includes(courtCaseSpecificOperation.code)
      )
    ) {
      return { code: ExceptionCode.HO200109, path: errorPath }
    }

    if (
      operationsWithCourtCase2.some(
        (courtCaseSpecificOperation) => courtCaseSpecificOperation.code === PncOperation.NORMAL_DISPOSAL
      )
    ) {
      return { code: ExceptionCode.HO200115, path: errorPath }
    }
  }

  const newRemandAndSentencing = operations.some((operation) => {
    const courtCaseReference = operationCourtCaseReference(operation)
    const remandCcrsContainCourtCaseReference = !!courtCaseReference && remandCcrs.has(courtCaseReference)

    return [PncOperation.SENTENCE_DEFERRED].includes(operation.code) && remandCcrsContainCourtCaseReference
  })

  if (newRemandAndSentencing) {
    return { code: ExceptionCode.HO200113, path: errorPath }
  }

  const checkForClashingCourtCaseOperations = (clashingCourtCaseOperations: PncOperation[]) =>
    operationsWithCourtCase2.some((operation) => {
      const courtCaseReference = operationCourtCaseReference(operation)
      const clashingOperation = operationsWithCourtCase2.find(
        (op) => operationCourtCaseReference(op) == courtCaseReference
      )

      return isEqual([operation.code, clashingOperation?.code].sort(), clashingCourtCaseOperations)
    })

  const newDisposalAndSentencing = checkForClashingCourtCaseOperations([
    PncOperation.NORMAL_DISPOSAL,
    PncOperation.SENTENCE_DEFERRED
  ])
  if (newDisposalAndSentencing) {
    return { code: ExceptionCode.HO200112, path: errorPath }
  }

  const newAndChangedDisposal = checkForClashingCourtCaseOperations([
    PncOperation.NORMAL_DISPOSAL,
    PncOperation.DISPOSAL_UPDATED
  ])
  if (newAndChangedDisposal) {
    return { code: ExceptionCode.HO200115, path: errorPath }
  }

  const changedDisposalAndSentencing = checkForClashingCourtCaseOperations([
    PncOperation.SENTENCE_DEFERRED,
    PncOperation.DISPOSAL_UPDATED
  ])
  if (changedDisposalAndSentencing) {
    return { code: ExceptionCode.HO200114, path: errorPath }
  }

  const operationsWithCourtCase: Operation[] = []

  for (const operation of operations) {
    const courtCaseReference = operationCourtCaseReference(operation)

    if (courtCaseSpecificOperations.includes(operation.code)) {
      const clashingOperation = operationsWithCourtCase.find(
        (op) => operationCourtCaseReference(op) == courtCaseReference
      )

      if (clashingOperation) {
        if (operation.code === clashingOperation.code) {
          return { code: ExceptionCode.HO200109, path: errorPath }
        }

        break
      }

      operationsWithCourtCase.push(operation)
    }
  }

  return undefined
}

export default validateOperations
