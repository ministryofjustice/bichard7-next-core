import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import isEqual from "lodash.isequal"
import errorPaths from "../../../lib/exceptions/errorPaths"
import type Exception from "../../../types/Exception"
import type { Operation } from "../../../types/PncUpdateDataset"
import operationCourtCaseReference from "./operationCourtCaseReference"
import { PNCMessageType } from "../../../types/operationCodes"

const errorPath = errorPaths.case.asn

const validateOperations = (operations: Operation[], remandCcrs: Set<string>): Exception | void => {
  let apphrdExists = false
  let comsenExists = false
  let sendefExists = false
  let newremExists = false
  let penhrgExists = false
  const courtCaseSpecificOperations: Operation[] = []

  for (const operation of operations) {
    penhrgExists ||= operation.code === PNCMessageType.PENALTY_HEARING
    newremExists ||= operation.code === PNCMessageType.REMAND
    sendefExists ||= operation.code === PNCMessageType.SENTENCE_DEFERRED
    comsenExists ||= operation.code === PNCMessageType.COMMITTED_SENTENCING
    apphrdExists ||= operation.code === PNCMessageType.APPEALS_UPDATE

    if (penhrgExists && apphrdExists) {
      return { code: ExceptionCode.HO200109, path: errorPath }
    }

    if (penhrgExists && sendefExists) {
      return { code: ExceptionCode.HO200114, path: errorPath }
    }

    if (penhrgExists && comsenExists) {
      break
    }

    if (newremExists && remandCcrs.size === 0 && apphrdExists) {
      return { code: ExceptionCode.HO200109, path: errorPath }
    }

    if (newremExists && remandCcrs.size === 0 && (comsenExists || sendefExists)) {
      return { code: ExceptionCode.HO200113, path: errorPath }
    }

    if (penhrgExists && courtCaseSpecificOperations.length > 0) {
      const incompatibleCode = courtCaseSpecificOperations[courtCaseSpecificOperations.length - 1].code
      if (
        [PNCMessageType.DISPOSAL_UPDATED, PNCMessageType.PENALTY_HEARING].includes(incompatibleCode as PNCMessageType)
      ) {
        return { code: ExceptionCode.HO200109, path: errorPath }
      }

      if (incompatibleCode === PNCMessageType.NORMAL_DISPOSAL) {
        return { code: ExceptionCode.HO200115, path: errorPath }
      }
    }

    const courtCaseReference = operationCourtCaseReference(operation)

    if (
      [
        PNCMessageType.APPEALS_UPDATE,
        PNCMessageType.COMMITTED_SENTENCING,
        PNCMessageType.SENTENCE_DEFERRED,
        PNCMessageType.DISPOSAL_UPDATED,
        PNCMessageType.NORMAL_DISPOSAL
      ].includes(operation.code as PNCMessageType)
    ) {
      const clashingOperation = courtCaseSpecificOperations.find(
        (op) => operationCourtCaseReference(op) == courtCaseReference
      )
      if (clashingOperation) {
        const sortedOperations = [operation.code, clashingOperation.code].sort()
        if (
          operation.code === clashingOperation.code ||
          sortedOperations.includes(PNCMessageType.APPEALS_UPDATE) ||
          isEqual(sortedOperations, [PNCMessageType.COMMITTED_SENTENCING, PNCMessageType.SENTENCE_DEFERRED]) ||
          isEqual(sortedOperations, [PNCMessageType.APPEALS_UPDATE, PNCMessageType.SENTENCE_DEFERRED])
        ) {
          return { code: ExceptionCode.HO200109, path: errorPath }
        }

        if (
          isEqual(sortedOperations, [PNCMessageType.COMMITTED_SENTENCING, PNCMessageType.NORMAL_DISPOSAL]) ||
          isEqual(sortedOperations, [PNCMessageType.NORMAL_DISPOSAL, PNCMessageType.SENTENCE_DEFERRED])
        ) {
          return { code: ExceptionCode.HO200112, path: errorPath }
        }

        if (isEqual(sortedOperations, [PNCMessageType.NORMAL_DISPOSAL, PNCMessageType.DISPOSAL_UPDATED])) {
          return { code: ExceptionCode.HO200115, path: errorPath }
        }

        if (isEqual(sortedOperations, [PNCMessageType.SENTENCE_DEFERRED, PNCMessageType.DISPOSAL_UPDATED])) {
          return { code: ExceptionCode.HO200114, path: errorPath }
        }

        break
      }

      courtCaseSpecificOperations.push(operation)
    }

    const remandCcrsContainCourtCaseReference = !!courtCaseReference && remandCcrs.has(courtCaseReference)

    if (operation.code === PNCMessageType.APPEALS_UPDATE && remandCcrsContainCourtCaseReference) {
      return { code: ExceptionCode.HO200109, path: errorPath }
    }

    if (
      [PNCMessageType.COMMITTED_SENTENCING, PNCMessageType.SENTENCE_DEFERRED].includes(
        operation.code as PNCMessageType
      ) &&
      remandCcrsContainCourtCaseReference
    ) {
      return { code: ExceptionCode.HO200113, path: errorPath }
    }
  }
}

export default validateOperations
