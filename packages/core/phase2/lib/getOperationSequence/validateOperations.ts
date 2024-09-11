import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import isEqual from "lodash.isequal"
import errorPaths from "../../../lib/exceptions/errorPaths"
import type Exception from "../../../types/Exception"
import type { Operation } from "../../../types/PncUpdateDataset"
import operationCourtCaseReference from "./operationCourtCaseReference"
import { PncOperation } from "../../../types/PncOperation"

const errorPath = errorPaths.case.asn

const validateOperations = (operations: Operation[], remandCcrs: Set<string>): Exception | void => {
  let apphrdExists = false
  let comsenExists = false
  let sendefExists = false
  let newremExists = false
  let penhrgExists = false
  const courtCaseSpecificOperations: Operation[] = []

  for (const operation of operations) {
    penhrgExists ||= operation.code === "PENHRG"
    newremExists ||= operation.code === PncOperation.REMAND
    sendefExists ||= operation.code === "SENDEF"
    comsenExists ||= operation.code === PncOperation.COMMITTED_SENTENCING
    apphrdExists ||= operation.code === PncOperation.APPEALS_UPDATE

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
      if (["SUBVAR", "PENHRG"].includes(incompatibleCode)) {
        return { code: ExceptionCode.HO200109, path: errorPath }
      }

      if (incompatibleCode === "DISARR") {
        return { code: ExceptionCode.HO200115, path: errorPath }
      }
    }

    const courtCaseReference = operationCourtCaseReference(operation)

    if (
      [PncOperation.APPEALS_UPDATE, PncOperation.COMMITTED_SENTENCING, "SENDEF", "SUBVAR", "DISARR"].includes(
        operation.code
      )
    ) {
      const clashingOperation = courtCaseSpecificOperations.find(
        (op) => operationCourtCaseReference(op) == courtCaseReference
      )
      if (clashingOperation) {
        const sortedOperations = [operation.code, clashingOperation.code].sort()
        if (
          operation.code === clashingOperation.code ||
          sortedOperations.includes(PncOperation.APPEALS_UPDATE) ||
          isEqual(sortedOperations, [PncOperation.COMMITTED_SENTENCING, "SENDEF"]) ||
          isEqual(sortedOperations, [PncOperation.APPEALS_UPDATE, "SENDEF"])
        ) {
          return { code: ExceptionCode.HO200109, path: errorPath }
        }

        if (
          isEqual(sortedOperations, [PncOperation.COMMITTED_SENTENCING, "DISARR"]) ||
          isEqual(sortedOperations, ["DISARR", "SENDEF"])
        ) {
          return { code: ExceptionCode.HO200112, path: errorPath }
        }

        if (isEqual(sortedOperations, ["DISARR", "SUBVAR"])) {
          return { code: ExceptionCode.HO200115, path: errorPath }
        }

        if (isEqual(sortedOperations, ["SENDEF", "SUBVAR"])) {
          return { code: ExceptionCode.HO200114, path: errorPath }
        }

        break
      }

      courtCaseSpecificOperations.push(operation)
    }

    const remandCcrsContainCourtCaseReference = !!courtCaseReference && remandCcrs.has(courtCaseReference)

    if (operation.code === PncOperation.APPEALS_UPDATE && remandCcrsContainCourtCaseReference) {
      return { code: ExceptionCode.HO200109, path: errorPath }
    }

    if ([PncOperation.COMMITTED_SENTENCING, "SENDEF"].includes(operation.code) && remandCcrsContainCourtCaseReference) {
      return { code: ExceptionCode.HO200113, path: errorPath }
    }
  }
}

export default validateOperations
