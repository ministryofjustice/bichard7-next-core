import EventCode from "@moj-bichard7/common/types/EventCode"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type AuditLogger from "../types/AuditLogger"
import type Phase2Result from "./types/Phase2Result"

import addExceptionsToAho from "../lib/exceptions/addExceptionsToAho"
import generateTriggers from "../lib/triggers/generateTriggers"
import Phase from "../types/Phase"
import { isPncUpdateDataset, type PncUpdateDataset } from "../types/PncUpdateDataset"
import generateExceptions from "./exceptions/generateExceptions"
import areAllResultsOnPnc from "./lib/areAllResultsOnPnc"
import { generateOperations } from "./lib/generateOperations"
import isAncillaryInterimCase from "./lib/isAncillaryInterimCase"
import refreshOperations from "./lib/refreshOperations"
import { Phase2ResultType } from "./types/Phase2Result"

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
      resultType: Phase2ResultType.ignored,
      triggerGenerationAttempted: true,
      triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE)
    }
  }

  const isRecordableOnPnc = !!hearingOutcome.Case.RecordableOnPNCindicator
  if (!isRecordableOnPnc) {
    auditLogger.info(EventCode.IgnoredNonrecordable)

    return {
      auditLogEvents: auditLogger.getEvents(),
      correlationId,
      outputMessage,
      resultType: Phase2ResultType.ignored,
      triggerGenerationAttempted: false,
      triggers: []
    }
  }

  const exceptions = generateExceptions(inputMessage)
  addExceptionsToAho(outputMessage, exceptions)
  if (exceptions.some(({ code }) => code !== ExceptionCode.HO200200)) {
    return {
      auditLogEvents: auditLogger.getEvents(),
      correlationId,
      outputMessage,
      resultType: Phase2ResultType.exceptions,
      triggerGenerationAttempted: false,
      triggers: []
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
      resultType: isResubmitted ? Phase2ResultType.success : Phase2ResultType.ignored,
      triggerGenerationAttempted: true,
      triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE)
    }
  }

  outputMessage.PncOperations = refreshOperations(outputMessage, operations)

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId,
    outputMessage,
    resultType: Phase2ResultType.success,
    triggerGenerationAttempted: false,
    triggers: []
  }
}

export default phase2
