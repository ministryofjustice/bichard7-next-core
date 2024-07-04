import EventCode from "@moj-bichard7/common/types/EventCode"
import generateTriggers from "../phase1/triggers/generate"
import type AuditLogger from "../phase1/types/AuditLogger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import MessageType from "../types/MessageType"
import Phase from "../types/Phase"
import { isPncUpdateDataset, type PncUpdateDataset } from "../types/PncUpdateDataset"
import allPncOffencesContainResults from "./lib/allPncOffencesContainResults"
import { getOperationSequence } from "./lib/getOperationSequence"
import isAintCase from "./lib/isAintCase"
import refreshOperationSequence from "./lib/refreshOperationSequence"
import { Phase2ResultType } from "./types/Phase2Result"

type ProcessMessageResult = { generateTriggers: boolean }

const processMessage = (
  auditLogger: AuditLogger,
  message: AnnotatedHearingOutcome | PncUpdateDataset,
  outputMessage: PncUpdateDataset
): ProcessMessageResult => {
  const messageType: MessageType = isPncUpdateDataset(message) ? "PncUpdateDataset" : "AnnotatedHearingOutcome"
  const hearingOutcome = message.AnnotatedHearingOutcome.HearingOutcome
  auditLogger.info(
    messageType === "PncUpdateDataset"
      ? EventCode.ReceivedResubmittedHearingOutcome
      : EventCode.HearingOutcomeReceivedPhase2
  )

  if (messageType === "AnnotatedHearingOutcome") {
    if (isAintCase(hearingOutcome)) {
      auditLogger.info(EventCode.IgnoredAncillary)
      return { generateTriggers: true }
    }

    const isRecordableOnPnc = !!hearingOutcome.Case.RecordableOnPNCindicator
    if (!isRecordableOnPnc) {
      auditLogger.info(EventCode.IgnoredNonrecordable)
      return { generateTriggers: false }
    }
  }

  if (!allPncOffencesContainResults(outputMessage)) {
    return { generateTriggers: false }
  }

  if (messageType === "PncUpdateDataset" && outputMessage.PncOperations.length) {
    refreshOperationSequence(outputMessage)
    auditLogger.info(EventCode.HearingOutcomeSubmittedPhase3)
    return { generateTriggers: false }
  }

  const isResubmitted = messageType === "PncUpdateDataset"
  const operations = getOperationSequence(outputMessage, isResubmitted)
  if (
    (messageType === "AnnotatedHearingOutcome" && outputMessage.HasError) ||
    (messageType === "PncUpdateDataset" && outputMessage.Exceptions.length)
  ) {
    return { generateTriggers: false }
  }

  if (operations.length) {
    outputMessage.PncOperations =
      messageType === "PncUpdateDataset" ? [...outputMessage.PncOperations, ...operations] : operations
  }

  if (messageType === "AnnotatedHearingOutcome" && !operations.length) {
    auditLogger.info(EventCode.IgnoredNonrecordable)
  }

  return { generateTriggers: !operations.length }
}

const phase2 = (message: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger) => {
  const outputMessage = structuredClone(message) as PncUpdateDataset
  outputMessage.HasError = false
  outputMessage.PncOperations = outputMessage.PncOperations ?? []
  const correlationId = message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  const processMessageResult = processMessage(auditLogger, message, outputMessage)

  const triggers = processMessageResult.generateTriggers ? generateTriggers(outputMessage, Phase.PNC_UPDATE) : []
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
