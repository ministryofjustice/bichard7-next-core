import EventCode from "@moj-bichard7/common/types/EventCode"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { areAllResultsAlreadyPresentOnPnc } from "./areAllResultsAlreadyPresentOnPnc"
import { generateOperations } from "./generateOperations"
import type ExceptionsAndOperations from "./generateOperations/ExceptionsAndOperations"
import sortOperations from "./sortOperations"
import { PncOperation } from "../../../types/PncOperation"

const getOperationSequence = (aho: AnnotatedHearingOutcome, resubmitted: boolean): ExceptionsAndOperations => {
  const { value: allResultsAlreadyOnPnc, exceptions } = areAllResultsAlreadyPresentOnPnc(aho)
  const operationsResult = generateOperations(aho, resubmitted, allResultsAlreadyOnPnc)
  if ("exceptions" in operationsResult) {
    return { operations: [], exceptions: operationsResult.exceptions.concat(exceptions) }
  }

  const { operations } = operationsResult
  const filteredOperations = allResultsAlreadyOnPnc
    ? operations.filter((operation) => operation.code === PncOperation.REMAND)
    : operations

  return {
    operations: sortOperations(filteredOperations),
    exceptions,
    events: allResultsAlreadyOnPnc ? [EventCode.IgnoredAlreadyOnPNC] : []
  }
}

export default getOperationSequence
