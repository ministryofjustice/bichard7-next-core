import EventCode from "@moj-bichard7/common/types/EventCode"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { areAllResultsAlreadyPresentOnPnc } from "./areAllResultsAlreadyPresentOnPnc"
import checkNoSequenceConditions from "./checkNoSequenceConditions"
import { generateOperations } from "./generateOperations"
import type ExceptionsAndOperations from "./generateOperations/ExceptionsAndOperations"
import sortOperations from "./sortOperations"
import { PNCMessageType } from "../../../types/operationCodes"

const getOperationSequence = (aho: AnnotatedHearingOutcome, resubmitted: boolean): ExceptionsAndOperations => {
  const checkNoSequenceConditionsExceptions = checkNoSequenceConditions(aho)
  if (checkNoSequenceConditionsExceptions.length > 0) {
    return { operations: [], exceptions: checkNoSequenceConditionsExceptions }
  }

  const { value: allResultsAlreadyOnPnc, exceptions } = areAllResultsAlreadyPresentOnPnc(aho)
  const operationsResult = generateOperations(aho, resubmitted, allResultsAlreadyOnPnc)
  if ("exceptions" in operationsResult) {
    return { operations: [], exceptions: operationsResult.exceptions.concat(exceptions) }
  }

  const { operations } = operationsResult
  const filteredOperations = allResultsAlreadyOnPnc
    ? operations.filter((operation) => operation.code === PNCMessageType.REMAND)
    : operations

  return {
    operations: sortOperations(filteredOperations),
    exceptions,
    events: allResultsAlreadyOnPnc ? [EventCode.IgnoredAlreadyOnPNC] : []
  }
}

export default getOperationSequence
