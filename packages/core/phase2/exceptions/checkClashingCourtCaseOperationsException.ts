import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { Operation } from "../../types/PncUpdateDataset"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import type Exception from "../../types/Exception"
import getCourtCaseReferenceFromOperation, {
  courtCaseSpecificOperations
} from "../lib/generateOperations/getCourtCaseReferenceFromOperation"
import type { PncOperation } from "../../types/PncOperation"
import isEqual from "lodash.isequal"
import type ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import { areAllResultsOnPnc } from "../lib/generateOperations/areAllResultsOnPnc"
import { generateOperationsFromOffenceResults } from "../lib/generateOperations/generateOperations"

const checkClashingCourtCaseOperationsException = (
  aho: AnnotatedHearingOutcome,
  clashingCourtCaseOperations: [PncOperation, PncOperation],
  exception: ExceptionCode
) => {
  const exceptions: Exception[] = []

  const operations = generateOperationsFromOffenceResults(aho, areAllResultsOnPnc(aho), isPncUpdateDataset(aho))
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

  return exceptions
}

export default checkClashingCourtCaseOperationsException
