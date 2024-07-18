import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import isEqual from "lodash.isequal"
import errorPaths from "../../../lib/errorPaths"
import type Exception from "../../../types/Exception"
import type { Operation } from "../../../types/PncUpdateDataset"
import operationCourtCaseReference from "./operationCourtCaseReference"

const errorPath = errorPaths.case.asn

const validateOperationSequence = (operations: Operation[], remandCcrs: Set<string>): Exception | void => {
  let apphrdExists = false
  let comsenExists = false
  let sendefExists = false
  let newremExists = false
  let penhrgExists = false
  const courtCaseSpecificOperations: Operation[] = []

  for (const operation of operations) {
    penhrgExists ||= operation.code === "PENHRG"
    newremExists ||= operation.code === "NEWREM"
    sendefExists ||= operation.code === "SENDEF"
    comsenExists ||= operation.code === "COMSEN"
    apphrdExists ||= operation.code === "APPHRD"

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

    if (["APPHRD", "COMSEN", "SENDEF", "SUBVAR", "DISARR"].includes(operation.code)) {
      const clashingOperation = courtCaseSpecificOperations.find(
        (op) => operationCourtCaseReference(op) == courtCaseReference
      )
      if (clashingOperation) {
        const sortedOperations = [operation.code, clashingOperation.code].sort()
        if (
          operation.code === clashingOperation.code ||
          sortedOperations.includes("APPHRD") ||
          isEqual(sortedOperations, ["COMSEN", "SENDEF"]) ||
          isEqual(sortedOperations, ["APPHRD", "SENDEF"])
        ) {
          return { code: ExceptionCode.HO200109, path: errorPath }
        }

        if (isEqual(sortedOperations, ["COMSEN", "DISARR"]) || isEqual(sortedOperations, ["DISARR", "SENDEF"])) {
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

    if (operation.code === "APPHRD" && remandCcrsContainCourtCaseReference) {
      return { code: ExceptionCode.HO200109, path: errorPath }
    }

    if (["COMSEN", "SENDEF"].includes(operation.code) && remandCcrsContainCourtCaseReference) {
      return { code: ExceptionCode.HO200113, path: errorPath }
    }
  }
}

export default validateOperationSequence
