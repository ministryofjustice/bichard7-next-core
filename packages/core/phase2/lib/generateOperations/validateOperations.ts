import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import isEqual from "lodash.isequal"
import errorPaths from "../../../lib/exceptions/errorPaths"
import type Exception from "../../../types/Exception"
import type { Operation } from "../../../types/PncUpdateDataset"
import operationCourtCaseReference from "./operationCourtCaseReference"
import { PncOperation } from "../../../types/PncOperation"

const errorPath = errorPaths.case.asn

const validateOperations = (operations: Operation[], remandCcrs: Set<string>): Exception | void => {
  let penhrgExists = false
  const courtCaseSpecificOperations: Operation[] = []

  const hasOperation = (pncOperation: PncOperation) => operations.some((operation) => operation.code === pncOperation)

  if (hasOperation(PncOperation.PENALTY_HEARING) && hasOperation(PncOperation.SENTENCE_DEFERRED)) {
    return { code: ExceptionCode.HO200114, path: errorPath }
  }

  if (hasOperation(PncOperation.REMAND) && remandCcrs.size === 0 && hasOperation(PncOperation.SENTENCE_DEFERRED)) {
    return { code: ExceptionCode.HO200113, path: errorPath }
  }

  for (const operation of operations) {
    penhrgExists ||= operation.code === PncOperation.PENALTY_HEARING

    if (penhrgExists && courtCaseSpecificOperations.length > 0) {
      const incompatibleCode = courtCaseSpecificOperations[courtCaseSpecificOperations.length - 1].code
      if ([PncOperation.DISPOSAL_UPDATED, PncOperation.PENALTY_HEARING].includes(incompatibleCode)) {
        return { code: ExceptionCode.HO200109, path: errorPath }
      }

      if (incompatibleCode === PncOperation.NORMAL_DISPOSAL) {
        return { code: ExceptionCode.HO200115, path: errorPath }
      }
    }

    const courtCaseReference = operationCourtCaseReference(operation)

    if (
      [PncOperation.SENTENCE_DEFERRED, PncOperation.DISPOSAL_UPDATED, PncOperation.NORMAL_DISPOSAL].includes(
        operation.code as PncOperation
      )
    ) {
      const clashingOperation = courtCaseSpecificOperations.find(
        (op) => operationCourtCaseReference(op) == courtCaseReference
      )
      if (clashingOperation) {
        const sortedOperations = [operation.code, clashingOperation.code].sort()
        if (operation.code === clashingOperation.code) {
          return { code: ExceptionCode.HO200109, path: errorPath }
        }

        if (isEqual(sortedOperations, [PncOperation.NORMAL_DISPOSAL, PncOperation.SENTENCE_DEFERRED])) {
          return { code: ExceptionCode.HO200112, path: errorPath }
        }

        if (isEqual(sortedOperations, [PncOperation.NORMAL_DISPOSAL, PncOperation.DISPOSAL_UPDATED])) {
          return { code: ExceptionCode.HO200115, path: errorPath }
        }

        if (isEqual(sortedOperations, [PncOperation.SENTENCE_DEFERRED, PncOperation.DISPOSAL_UPDATED])) {
          return { code: ExceptionCode.HO200114, path: errorPath }
        }

        break
      }

      courtCaseSpecificOperations.push(operation)
    }

    const remandCcrsContainCourtCaseReference = !!courtCaseReference && remandCcrs.has(courtCaseReference)

    if (
      [PncOperation.SENTENCE_DEFERRED].includes(operation.code as PncOperation) &&
      remandCcrsContainCourtCaseReference
    ) {
      return { code: ExceptionCode.HO200113, path: errorPath }
    }
  }
}

export default validateOperations
