import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import operationCourtCaseReference from "../lib/generateOperations/operationCourtCaseReference"
import { PncOperation } from "../../types/PncOperation"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import checkOperationsException from "./checkOperationsException"
import errorPaths from "../../lib/exceptions/errorPaths"
import extractRemandCcrs from "../lib/generateOperations/extractRemandCcrs"
import deduplicateOperations from "../lib/generateOperations/deduplicateOperations"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  checkOperationsException(aho, (operations) => {
    const remandCcrs = extractRemandCcrs(operations, false)
    const deduplicatedOperations = deduplicateOperations(operations)

    const hasNewRemandAndSentencing = deduplicatedOperations.some((operation) => {
      const courtCaseReference = operationCourtCaseReference(operation)
      const remandCcrsContainCourtCaseReference = !!courtCaseReference && remandCcrs.has(courtCaseReference)

      return (
        PncOperation.SENTENCE_DEFERRED === operation.code &&
        ((deduplicatedOperations.some((operation) => operation.code === PncOperation.REMAND) &&
          remandCcrs.size === 0) ||
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
