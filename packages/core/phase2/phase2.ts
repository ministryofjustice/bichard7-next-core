import EventCode from "@moj-bichard7/common/types/EventCode"
import generateTriggers from "../phase1/triggers/generate"
import type AuditLogger from "../phase1/types/AuditLogger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import Phase from "../types/Phase"
import { isPncUpdateDataset, type PncUpdateDataset } from "../types/PncUpdateDataset"
import allPncOffencesContainResults from "./lib/allPncOffencesContainResults"
import { getOperationSequence } from "./lib/getOperationSequence"
import isAintCase from "./lib/isAintCase"
import refreshOperationSequence from "./lib/refreshOperationSequence"
import { Phase2ResultType } from "./types/Phase2Result"

type ProcessPhase2Result = { generateTriggers: boolean }

const initialiseOutputMessage = (message: AnnotatedHearingOutcome | PncUpdateDataset): PncUpdateDataset => {
  const outputMessage = structuredClone(message) as PncUpdateDataset
  outputMessage.HasError = false
  outputMessage.PncOperations = outputMessage.PncOperations ?? []
  return outputMessage
}

const processAho = (
  auditLogger: AuditLogger,
  aho: AnnotatedHearingOutcome,
  outputMessage: PncUpdateDataset
): ProcessPhase2Result => {
  auditLogger.info(EventCode.HearingOutcomeReceivedPhase2)
  const hearingOutcome = aho.AnnotatedHearingOutcome.HearingOutcome
  const isRecordableOnPnc = !!hearingOutcome.Case.RecordableOnPNCindicator

  if (isAintCase(hearingOutcome)) {
    auditLogger.info(EventCode.IgnoredAncillary)
    return { generateTriggers: true }
  }

  if (!isRecordableOnPnc) {
    auditLogger.info(EventCode.IgnoredNonrecordable)
    return { generateTriggers: false }
  }

  if (!allPncOffencesContainResults(outputMessage)) {
    return { generateTriggers: false }
  }

  const operations = getOperationSequence(outputMessage, false)
  if (outputMessage.HasError) {
    return { generateTriggers: false }
  }

  outputMessage.PncOperations = operations.length ? operations : outputMessage.PncOperations

  if (!operations.length) {
    auditLogger.info(EventCode.IgnoredNonrecordable)
    return { generateTriggers: true }
  }

  return { generateTriggers: false }
}

const processPncUpdateDataset = (auditLogger: AuditLogger, outputMessage: PncUpdateDataset) => {
  auditLogger.info(EventCode.ReceivedResubmittedHearingOutcome)
  const allOffencesContainResults = allPncOffencesContainResults(outputMessage)

  if (!allOffencesContainResults) {
    return { generateTriggers: false }
  }

  if (outputMessage.PncOperations.length) {
    refreshOperationSequence(outputMessage)
    auditLogger.info(EventCode.HearingOutcomeSubmittedPhase3)
    return { generateTriggers: false }
  }

  const operations = getOperationSequence(outputMessage, true)

  if (outputMessage.Exceptions.length) {
    return { generateTriggers: false }
  }

  if (operations.length) {
    outputMessage.PncOperations.push(...operations)
  }

  return { generateTriggers: !operations.length }
}

const phase2 = (message: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger) => {
  const outputMessage = initialiseOutputMessage(message)
  const correlationId = message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  const processResult = isPncUpdateDataset(message)
    ? processPncUpdateDataset(auditLogger, outputMessage)
    : processAho(auditLogger, message, outputMessage)

  const triggers = processResult.generateTriggers ? generateTriggers(outputMessage, Phase.PNC_UPDATE) : []
  outputMessage.HasError = false

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId,
    outputMessage,
    triggers,
    resultType: Phase2ResultType.success
  }
}

export default phase2
