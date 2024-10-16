import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { Operation } from "../../types/PncUpdateDataset"
import type Exception from "../../types/Exception"
import checkOperationsException from "./checkOperationsException"
import getCourtCaseReferenceFromOperation, {
  courtCaseSpecificOperations
} from "../lib/generateOperations/getCourtCaseReferenceFromOperation"
import type { PncOperation } from "../../types/PncOperation"
import isEqual from "lodash.isequal"
import type ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"

const checkClashingCourtCaseOperationsException = (
  aho: AnnotatedHearingOutcome,
  clashingCourtCaseOperations: [PncOperation, PncOperation],
  exception: ExceptionCode
) => {
  const exceptions: Exception[] = []

  checkOperationsException(aho, (operations) => {
    const operationsWithCourtCase: Operation[] = operations.filter((operation) =>
      courtCaseSpecificOperations.includes(operation.code)
    )

    const hasClashingCourtCaseOperations = operationsWithCourtCase.some((operation) => {
      const clashingCourtCaseOperation = operationsWithCourtCase.find(
        (operationWithCourtCase) =>
          getCourtCaseReferenceFromOperation(operationWithCourtCase) == getCourtCaseReferenceFromOperation(operation)
      )

      return isEqual([operation.code, clashingCourtCaseOperation?.code].sort(), clashingCourtCaseOperations)
    })

    if (hasClashingCourtCaseOperations) {
      exceptions.push({ code: exception, path: errorPaths.case.asn })
    }
  })

  return exceptions
}

export default checkClashingCourtCaseOperationsException
