import EventCode from "@moj-bichard7/common/types/EventCode"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import addExceptionsToAho from "../lib/exceptions/addExceptionsToAho"
import generateTriggers from "../lib/triggers/generateTriggers"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type AuditLogger from "../types/AuditLogger"
import Phase from "../types/Phase"
import { isPncUpdateDataset, type PncUpdateDataset } from "../types/PncUpdateDataset"
import type { Trigger } from "../types/Trigger"
import allPncOffencesContainResults from "./lib/allPncOffencesContainResults"
import { getOperationSequence } from "./lib/getOperationSequence"
import isAintCase from "./lib/isAintCase"
import refreshOperationSequence from "./lib/refreshOperationSequence"
import type Phase2Result from "./types/Phase2Result"
import { Phase2ResultType } from "./types/Phase2Result"

type ProcessMessageResult = { triggers?: Trigger[]; resultType?: Phase2ResultType } | undefined

const processMessage = (
  auditLogger: AuditLogger,
  inputMessage: AnnotatedHearingOutcome | PncUpdateDataset,
  outputMessage: PncUpdateDataset
): ProcessMessageResult => {
  const isResubmitted = isPncUpdateDataset(inputMessage)
  const hearingOutcome = inputMessage.AnnotatedHearingOutcome.HearingOutcome
  auditLogger.info(isResubmitted ? EventCode.ReceivedResubmittedHearingOutcome : EventCode.HearingOutcomeReceivedPhase2)

  if (isAintCase(hearingOutcome)) {
    auditLogger.info(EventCode.IgnoredAncillary)
    return { triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE) }
  }

  const isRecordableOnPnc = !!hearingOutcome.Case.RecordableOnPNCindicator
  if (!isRecordableOnPnc) {
    auditLogger.info(EventCode.IgnoredNonrecordable)
    return { resultType: Phase2ResultType.ignored }
  }

  const allOffencesContainResultsExceptions = allPncOffencesContainResults(outputMessage)
  if (allOffencesContainResultsExceptions.length > 0) {
    allOffencesContainResultsExceptions.forEach(({ code, path }) => addExceptionsToAho(outputMessage, code, path))
    return
  }

  const { operations, exceptions } = getOperationSequence(outputMessage, isResubmitted)
  exceptions.forEach(({ code, path }) => addExceptionsToAho(outputMessage, code, path))
  if (exceptions.filter((exception) => exception.code !== ExceptionCode.HO200200).length > 0) {
    return
  }

  if (operations.length === 0) {
    if (!isResubmitted) {
      auditLogger.info(EventCode.IgnoredNonrecordable)
    }

    return { triggers: generateTriggers(outputMessage, Phase.PNC_UPDATE) }
  }

  refreshOperationSequence(outputMessage, operations)

  auditLogger.info(EventCode.HearingOutcomeSubmittedPhase3)
}

const phase2 = (message: AnnotatedHearingOutcome | PncUpdateDataset, auditLogger: AuditLogger): Phase2Result => {
  const outputMessage = structuredClone(message) as PncUpdateDataset
  outputMessage.HasError = false
  outputMessage.PncOperations = outputMessage.PncOperations ?? []
  const correlationId = message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  const processMessageResult = processMessage(auditLogger, message, outputMessage)

  const triggers = processMessageResult?.triggers ?? []
  const resultType = processMessageResult?.resultType
    ? processMessageResult.resultType
    : outputMessage.Exceptions.length > 0
    ? Phase2ResultType.exceptions
    : Phase2ResultType.success

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId,
    outputMessage,
    triggers,
    resultType
  }
}

export default phase2
