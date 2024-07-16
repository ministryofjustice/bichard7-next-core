import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import isEqual from "lodash.isequal"
import errorPaths from "../../../../phase1/lib/errorPaths"
import Exception from "../../../../phase1/types/Exception"
import { Operation } from "../../../../types/PncUpdateDataset"
import operationCourtCaseReference from "../operationCourtCaseReference"
import incompatibleOperationExceptionCode from "./incompatibleOperationExceptionCode"

const errorPath = errorPaths.case.asn

const generateIncompatibleOperationExceptions = (
  operations: Operation[],
  remandCcrs: Set<string>
): Exception | void => {
  let apphrdExists = false
  let comsenExists = false
  let sendefExists = false
  let newremExists = false
  let penhrgExists = false
  const courtCaseSpecificOperations: Operation[] = []

  let incompatibleCodePairs: [string, string] | undefined
  let operationCode: string

  for (let i = 0; i < operations.length; i++) {
    operationCode = operations[i].code

    if (operationCode === "PENHRG") {
      penhrgExists = true
    }
    // NEWREM: can coexist with any operation except APPHRD, COMSEN or SENDEF.
    else if (operationCode === "NEWREM") {
      newremExists = true
    }
    // All others: cannot coexist with any court case-specific operation with the same
    // court case reference.
    else if (operationCode === "SENDEF") {
      sendefExists = true
    } else if (operationCode === "COMSEN") {
      comsenExists = true
    } else if (operationCode === "APPHRD") {
      apphrdExists = true
    }

    // All others: cannot coexist with PENHRG
    // Also APPHRD, COMSEN and SENDEF cannot coexist with NEWREM.
    if (penhrgExists && apphrdExists) {
      return { code: ExceptionCode.HO200109, path: errorPath }
    }

    if (penhrgExists && (comsenExists || sendefExists)) {
      const code = "PENHRG"
      const incompatibleCode = comsenExists ? "COMSEN" : "SENDEF"
      incompatibleCodePairs = [code, incompatibleCode]
      break
    }

    if (newremExists && remandCcrs.size === 0 && apphrdExists) {
      return { code: ExceptionCode.HO200109, path: errorPath }
    }

    if (newremExists && remandCcrs.size === 0 && (comsenExists || sendefExists)) {
      return { code: ExceptionCode.HO200113, path: errorPath }
    }

    // PENHRG: cannot coexist with any court case-specific operation.
    if (penhrgExists && courtCaseSpecificOperations.length > 0) {
      const code = "PENHRG"
      const incompatibleCode = courtCaseSpecificOperations[courtCaseSpecificOperations.length - 1].code
      if (incompatibleCode === "SUBVAR") {
        return { code: ExceptionCode.HO200109, path: errorPath }
      }
      if (incompatibleCode === "DISARR") {
        return { code: ExceptionCode.HO200115, path: errorPath }
      }
      if (incompatibleCode === code) {
        return { code: ExceptionCode.HO200109, path: errorPath }
      }

      incompatibleCodePairs = [code, incompatibleCode]
      break
    }

    const courtCaseReference = operationCourtCaseReference(operations[i])

    if (["APPHRD", "COMSEN", "SENDEF", "SUBVAR", "DISARR"].includes(operationCode)) {
      const clashingOperation = courtCaseSpecificOperations.find(
        (op) => operationCourtCaseReference(op) == courtCaseReference
      )
      if (!!clashingOperation) {
        if (operationCode === clashingOperation.code) {
          return { code: ExceptionCode.HO200109, path: errorPath }
        }

        if (operationCode === "APPHRD" || clashingOperation.code === "APPHRD") {
          return { code: ExceptionCode.HO200109, path: errorPath }
        }

        const sortedOperations = [operationCode, clashingOperation.code].sort()
        if (isEqual(sortedOperations, ["COMSEN", "DISARR"])) {
          return { code: ExceptionCode.HO200112, path: errorPath }
        }

        if (isEqual(sortedOperations, ["DISARR", "SUBVAR"])) {
          return { code: ExceptionCode.HO200115, path: errorPath }
        }

        incompatibleCodePairs = [clashingOperation.code, operationCode]
        break
      }

      courtCaseSpecificOperations.push(operations[i])
    }

    const remandCcrsContainCourtCaseReference = !!courtCaseReference && remandCcrs.has(courtCaseReference)

    if (operationCode === "APPHRD" && remandCcrsContainCourtCaseReference) {
      return { code: ExceptionCode.HO200109, path: errorPath }
    }

    if (["COMSEN", "SENDEF"].includes(operationCode) && remandCcrsContainCourtCaseReference) {
      return { code: ExceptionCode.HO200113, path: errorPath }
    }
  }

  if (incompatibleCodePairs) {
    const errorCode = incompatibleOperationExceptionCode(incompatibleCodePairs)
    if (errorCode) {
      return { code: errorCode, path: errorPath }
    }
  }
}

export default generateIncompatibleOperationExceptions
