import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"
import type { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import { isPncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import isEqual from "lodash.isequal"

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

    return isEqual([operation.code, clashingCourtCaseOperation?.code].sort(), clashingCourtCaseOperations) // NOSONAR
  })

  if (hasClashingCourtCaseOperations) {
    exceptions.push({ code: exception, path: errorPaths.case.asn })
  }

  return exceptions
}

export default checkClashingCourtCaseOperationsException
