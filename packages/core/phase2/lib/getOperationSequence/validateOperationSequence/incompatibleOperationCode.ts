import type { Operation } from "../../../../types/PncUpdateDataset"
import operationCourtCaseReference from "../operationCourtCaseReference"

const incompatibleOperationCode = (operations: Operation[], remandCcrs: Set<string>): [string, string] | undefined => {
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
    if (penhrgExists && (apphrdExists || comsenExists || sendefExists)) {
      const code = "PENHRG"
      const incompatibleCode = apphrdExists ? "APPHRD" : comsenExists ? "COMSEN" : "SENDEF"
      return [code, incompatibleCode]
    }

    if (newremExists && remandCcrs.size === 0 && (apphrdExists || comsenExists || sendefExists)) {
      const code = "NEWREM"
      const incompatibleCode = apphrdExists ? "APPHRD" : comsenExists ? "COMSEN" : "SENDEF"
      return [code, incompatibleCode]
    }

    // PENHRG: cannot coexist with any court case-specific operation.
    if (penhrgExists && courtCaseSpecificOperations.length > 0) {
      const code = "PENHRG"
      const incompatibleCode = courtCaseSpecificOperations[courtCaseSpecificOperations.length - 1].code
      return [code, incompatibleCode]
    }

    const courtCaseReference = operationCourtCaseReference(operations[i])

    if (["APPHRD", "COMSEN", "SENDEF", "SUBVAR", "DISARR"].includes(operationCode)) {
      const clashingOperation = courtCaseSpecificOperations.find(
        (op) => operationCourtCaseReference(op) == courtCaseReference
      )
      if (!!clashingOperation) {
        return [clashingOperation.code, operationCode]
      }

      courtCaseSpecificOperations.push(operations[i])
    }

    const remandCcrsContainCourtCaseReference = !!courtCaseReference && remandCcrs.has(courtCaseReference)

    if (["APPHRD", "COMSEN", "SENDEF"].includes(operationCode) && remandCcrsContainCourtCaseReference) {
      return ["NEWREM", operationCode]
    }
  }

  return incompatibleCodePairs
}

export default incompatibleOperationCode
