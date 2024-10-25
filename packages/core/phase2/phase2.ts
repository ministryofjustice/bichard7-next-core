import EventCode from "@moj-bichard7/common/types/EventCode"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import addExceptionsToAho from "../lib/exceptions/addExceptionsToAho"
import generateTriggers from "../lib/triggers/generateTriggers"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type AuditLogger from "../types/AuditLogger"
import Phase from "../types/Phase"
import { isPncUpdateDataset, type PncUpdateDataset } from "../types/PncUpdateDataset"
import type { Trigger } from "../types/Trigger"
import isAintCase from "./lib/isAintCase"
import refreshOperations from "./lib/refreshOperations"
import type Phase2Result from "./types/Phase2Result"
import { Phase2ResultType } from "./types/Phase2Result"
import generateExceptions from "./exceptions/generateExceptions"
import { generateOperations } from "./lib/generateOperations"
import { areAllResultsOnPnc } from "./lib/generateOperations/areAllResultsOnPnc"

type ProcessMessageResult = {
  triggers?: Trigger[]
  triggerGenerationAttempted: boolean
  resultType: Phase2ResultType
}

const processMessage = (
  auditLogger: AuditLogger,
  inputMessage: AnnotatedHearingOutcome | PncUpdateDataset,
  outputMessage: PncUpdateDataset
): ProcessMessageResult => {
  const isResubmitted = isPncUpdateDataset(inputMessage)
  const hearingOutcome = inputMessage.AnnotatedHearingOutcome.HearingOutcome

  if (!isResubmitted && isAintCase(hearingOutcome)) {
    auditLogger.info(EventCode.IgnoredAncillary)

    return {
      triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE),
      triggerGenerationAttempted: true,
      resultType: Phase2ResultType.ignored
    }
  }

  const isRecordableOnPnc = !!hearingOutcome.Case.RecordableOnPNCindicator
  if (!isRecordableOnPnc) {
    auditLogger.info(EventCode.IgnoredNonrecordable)

    return { resultType: Phase2ResultType.ignored, triggerGenerationAttempted: false }
  }

  const exceptions = generateExceptions(inputMessage)
  addExceptionsToAho(outputMessage, exceptions)
  if (exceptions.some(({ code }) => code !== ExceptionCode.HO200200)) {
    return { resultType: Phase2ResultType.exceptions, triggerGenerationAttempted: false }
  }

  const allResultsOnPnc = areAllResultsOnPnc(outputMessage)
  if (allResultsOnPnc) {
    auditLogger.info(EventCode.IgnoredAlreadyOnPNC)
  }

  const operations = generateOperations(outputMessage, isResubmitted, allResultsOnPnc)

  if (operations.length === 0) {
    if (!isResubmitted) {
      auditLogger.info(EventCode.IgnoredNonrecordable)
    }

    return {
      triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE),
      triggerGenerationAttempted: true,
      resultType: isResubmitted ? Phase2ResultType.success : Phase2ResultType.ignored
    }
  }

  outputMessage.PncOperations = refreshOperations(outputMessage, operations)

  auditLogger.info(EventCode.HearingOutcomeSubmittedPhase3)

  return { resultType: Phase2ResultType.success, triggerGenerationAttempted: false }
}

const phase2 = (message: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = structuredClone(message) as PncUpdateDataset
  outputMessage.HasError = false
  outputMessage.PncOperations = outputMessage.PncOperations ?? []
  const correlationId = message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  const { triggers, triggerGenerationAttempted, resultType } = processMessage(auditLogger, message, outputMessage)

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId,
    outputMessage,
    triggers: triggers ?? [],
    triggerGenerationAttempted,
    resultType
  }
}

export default phase2
