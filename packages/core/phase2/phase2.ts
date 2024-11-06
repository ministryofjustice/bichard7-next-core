import EventCode from "@moj-bichard7/common/types/EventCode"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import addExceptionsToAho from "../lib/exceptions/addExceptionsToAho"
import generateTriggers from "../lib/triggers/generateTriggers"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type AuditLogger from "../types/AuditLogger"
import Phase from "../types/Phase"
import { isPncUpdateDataset, type PncUpdateDataset } from "../types/PncUpdateDataset"
import isAncillaryInterimCase from "./lib/isAncillaryInterimCase"
import refreshOperations from "./lib/refreshOperations"
import type Phase2Result from "./types/Phase2Result"
import { Phase2ResultType } from "./types/Phase2Result"
import generateExceptions from "./exceptions/generateExceptions"
import { generateOperations } from "./lib/generateOperations"
import areAllResultsOnPnc from "./lib/areAllResultsOnPnc"

const phase2 = (inputMessage: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger): Phase2Result => {
  const correlationId = inputMessage.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  const outputMessage = structuredClone(inputMessage) as PncUpdateDataset
  outputMessage.HasError = false
  outputMessage.PncOperations = outputMessage.PncOperations ?? []

  const isResubmitted = isPncUpdateDataset(inputMessage)
  const hearingOutcome = inputMessage.AnnotatedHearingOutcome.HearingOutcome

  if (!isResubmitted && isAncillaryInterimCase(hearingOutcome)) {
    auditLogger.info(EventCode.IgnoredAncillary)

    return {
      auditLogEvents: auditLogger.getEvents(),
      correlationId,
      outputMessage,
      triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE),
      triggerGenerationAttempted: true,
      resultType: Phase2ResultType.ignored
    }
  }

  const isRecordableOnPnc = !!hearingOutcome.Case.RecordableOnPNCindicator
  if (!isRecordableOnPnc) {
    auditLogger.info(EventCode.IgnoredNonrecordable)

    return {
      auditLogEvents: auditLogger.getEvents(),
      correlationId,
      outputMessage,
      triggers: [],
      triggerGenerationAttempted: false,
      resultType: Phase2ResultType.ignored
    }
  }

  const exceptions = generateExceptions(inputMessage)
  addExceptionsToAho(outputMessage, exceptions)
  if (exceptions.some(({ code }) => code !== ExceptionCode.HO200200)) {
    return {
      auditLogEvents: auditLogger.getEvents(),
      correlationId,
      outputMessage,
      triggers: [],
      triggerGenerationAttempted: false,
      resultType: Phase2ResultType.exceptions
    }
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
      auditLogEvents: auditLogger.getEvents(),
      correlationId,
      outputMessage,
      triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE),
      triggerGenerationAttempted: true,
      resultType: isResubmitted ? Phase2ResultType.success : Phase2ResultType.ignored
    }
  }

  outputMessage.PncOperations = refreshOperations(outputMessage, operations)

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId,
    outputMessage,
    triggers: [],
    triggerGenerationAttempted: false,
    resultType: Phase2ResultType.success
  }
}

export default phase2
