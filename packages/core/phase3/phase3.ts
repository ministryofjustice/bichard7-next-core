import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"

import type AuditLogger from "../types/AuditLogger"
import type PncGatewayInterface from "../types/PncGatewayInterface"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import type Phase3Result from "./types/Phase3Result"

import generateTriggersLogAttributes from "../lib/auditLog/generateTriggersLogAttributes"
import generateTriggers from "../lib/triggers/generateTriggers"
import Phase from "../types/Phase"
import performOperation from "./lib/performOperation"
import { Phase3ResultType } from "./types/Phase3Result"

const phase3 = async (
  inputMessage: PncUpdateDataset,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): Promise<Phase3Result> => {
  auditLogger.info(EventCode.HearingOutcomeReceivedPhase3)
  const correlationId = inputMessage.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  for (const operation of inputMessage.PncOperations) {
    if (operation.status === "Completed") {
      continue
    }

    const operationResult = await performOperation(inputMessage, operation, pncGateway).catch((error) => error)
    if (isError(operationResult)) {
      return {
        auditLogEvents: auditLogger.getEvents(),
        correlationId,
        outputMessage: inputMessage,
        triggers: [],
        triggerGenerationAttempted: false,
        resultType: Phase3ResultType.exceptions
      }
    }
  }

  const triggers = generateTriggers(inputMessage, Phase.PHASE_3)
  if (triggers.length > 0) {
    auditLogger.info(
      EventCode.TriggersGenerated,
      generateTriggersLogAttributes(triggers, inputMessage.Exceptions.length > 0)
    )
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
