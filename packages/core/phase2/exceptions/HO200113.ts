import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import { PncOperation } from "../../types/PncOperation"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import { generateOperationsFromOffenceResults } from "../lib/generateOperations/generateOperations"
import getCourtCaseReferenceFromOperation from "./getCourtCaseReferenceFromOperation"

const HO200113: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  const operations = generateOperationsFromOffenceResults(aho, areAllResultsOnPnc(aho), isPncUpdateDataset(aho))

  const remandCcrs = operations
    .filter((operation) => operation.code === PncOperation.REMAND)
    .reduce((remandCcrs, remandOperation) => {
      if (remandOperation.courtCaseReference) {
        remandCcrs.add(remandOperation.courtCaseReference)
      }

      return remandCcrs
    }, new Set<string | undefined>())

  const hasNewRemandAndSentencing = operations.some((operation) => {
    const courtCaseReference = getCourtCaseReferenceFromOperation(operation)
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

  return exceptions
}

export default HO200113
