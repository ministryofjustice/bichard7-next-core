import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import operationCourtCaseReference from "../lib/generateOperations/operationCourtCaseReference"
import { PncOperation } from "../../types/PncOperation"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import checkOperationsException from "./checkOperationsException"
import errorPaths from "../../lib/exceptions/errorPaths"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  checkOperationsException(aho, (operations) => {
    const remandCcrs = operations
      .filter((operation) => operation.code === PncOperation.REMAND)
      .reduce((remandCcrs, remandOperation) => {
        if (remandOperation.courtCaseReference) {
          remandCcrs.add(remandOperation.courtCaseReference)
        }

        return remandCcrs
      }, new Set<string | undefined>())

    const hasNewRemandAndSentencing = operations.some((operation) => {
      const courtCaseReference = operationCourtCaseReference(operation)
      const remandCcrsContainCourtCaseReference = !!courtCaseReference && remandCcrs.has(courtCaseReference)

      return (
        PncOperation.SENTENCE_DEFERRED === operation.code &&
        ((operations.some((operation) => operation.code === PncOperation.REMAND) && remandCcrs.size === 0) ||
          remandCcrsContainCourtCaseReference)
      )
    })

    if (hasNewRemandAndSentencing) {
      exceptions.push({ code: ExceptionCode.HO200113, path: errorPaths.case.asn })
    }
  })

  return exceptions
}

export default generator
