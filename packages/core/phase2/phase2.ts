import EventCode from "@moj-bichard7/common/types/EventCode"
import generateTriggers from "../phase1/triggers/generate"
import type AuditLogger from "../phase1/types/AuditLogger"
import type { Trigger } from "../phase1/types/Trigger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type MessageType from "../types/MessageType"
import Phase from "../types/Phase"
import { isPncUpdateDataset, type PncUpdateDataset } from "../types/PncUpdateDataset"
import allPncOffencesContainResults from "./lib/allPncOffencesContainResults"
import { getOperationSequence } from "./lib/getOperationSequence"
import isAintCase from "./lib/isAintCase"
import refreshOperationSequence from "./lib/refreshOperationSequence"
import { Phase2ResultType } from "./types/Phase2Result"

type ProcessMessageResult = { triggers: Trigger[] } | undefined

const processMessage = (
  auditLogger: AuditLogger,
  inputMessage: AnnotatedHearingOutcome | PncUpdateDataset,
  outputMessage: PncUpdateDataset
): ProcessMessageResult => {
  const messageType: MessageType = isPncUpdateDataset(inputMessage) ? "PncUpdateDataset" : "AnnotatedHearingOutcome"
  const hearingOutcome = inputMessage.AnnotatedHearingOutcome.HearingOutcome
  auditLogger.info(
    messageType === "PncUpdateDataset"
      ? EventCode.ReceivedResubmittedHearingOutcome
      : EventCode.HearingOutcomeReceivedPhase2
  )

  if (messageType === "AnnotatedHearingOutcome") {
    if (isAintCase(hearingOutcome)) {
      auditLogger.info(EventCode.IgnoredAncillary)
      return { triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE) }
    }

    const isRecordableOnPnc = !!hearingOutcome.Case.RecordableOnPNCindicator
    if (!isRecordableOnPnc) {
      auditLogger.info(EventCode.IgnoredNonrecordable)
      return
    }
  }

  if (!allPncOffencesContainResults(outputMessage)) {
    return
  }

  if (messageType === "PncUpdateDataset" && outputMessage.PncOperations.length) {
    refreshOperationSequence(outputMessage)
    auditLogger.info(EventCode.HearingOutcomeSubmittedPhase3)
    return
  }

  const isResubmitted = messageType === "PncUpdateDataset"
  const operations = getOperationSequence(outputMessage, isResubmitted)
  if (outputMessage.HasError) {
    return
  }

  if (!operations.length) {
    if (messageType === "AnnotatedHearingOutcome") {
      auditLogger.info(EventCode.IgnoredNonrecordable)
    }

    return { triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE) }
  }

  outputMessage.PncOperations =
    messageType === "PncUpdateDataset" ? [...outputMessage.PncOperations, ...operations] : operations
}

const phase2 = (message: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger) => {
  const outputMessage = structuredClone(message) as PncUpdateDataset
  outputMessage.HasError = false
  outputMessage.PncOperations = outputMessage.PncOperations ?? []
  const correlationId = message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  const processMessageResult = processMessage(auditLogger, message, outputMessage)

  const triggers = processMessageResult?.triggers ?? []
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
