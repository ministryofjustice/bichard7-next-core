import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import isEqual from "lodash.isequal"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { PncOperation } from "../../types/PncOperation"
import type { Operation } from "../../types/PncUpdateDataset"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import { generateOperationsFromOffenceResults } from "../lib/generateOperations/generateOperations"
import getCourtCaseReferenceFromOperation, { courtCaseSpecificOperations } from "./getCourtCaseReferenceFromOperation"

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
