import EventCode from "@moj-bichard7/common/types/EventCode"

import type AuditLogger from "../types/AuditLogger"
import type PncGatewayInterface from "../types/PncGatewayInterface"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import type Phase3Result from "./types/Phase3Result"

import generateExceptionLogAttributes from "../lib/auditLog/generateExceptionLogAttributes"
import generateTriggersLogAttributes from "../lib/auditLog/generateTriggersLogAttributes"
import { PncApiError } from "../lib/PncGateway"
import generateTriggers from "../lib/triggers/generateTriggers"
import Phase from "../types/Phase"
import performOperations from "./lib/performOperations"
import { Phase3ResultType } from "./types/Phase3Result"
import PncUpdateRequestError from "./types/PncUpdateRequestError"

const phase3 = async (
  inputMessage: PncUpdateDataset,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): Promise<Phase3Result | PncUpdateRequestError> => {
  const correlationId = inputMessage.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  const operationResult = await performOperations(inputMessage, pncGateway).catch((error) => error)
  if (operationResult instanceof PncApiError) {
    auditLogger.info(EventCode.ExceptionsGenerated, generateExceptionLogAttributes(inputMessage))

    return {
      auditLogEvents: auditLogger.getEvents(),
      correlationId,
      outputMessage: inputMessage,
      triggers: [],
      triggerGenerationAttempted: false,
      resultType: Phase3ResultType.exceptions
    }
  } else if (operationResult instanceof PncUpdateRequestError) {
    return operationResult
  }

  const triggers = generateTriggers(inputMessage, Phase.PHASE_3)
  if (triggers.length > 0) {
    auditLogger.info(EventCode.TriggersGenerated, generateTriggersLogAttributes(triggers, false))
  }

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId,
    outputMessage: inputMessage,
    triggers,
    triggerGenerationAttempted: true,
    resultType: Phase3ResultType.success
  }
}

export default phase3
