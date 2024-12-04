import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import generateTriggers from "../lib/triggers/generateTriggers"
import type AuditLogger from "../types/AuditLogger"
import Phase from "../types/Phase"
import type PncGatewayInterface from "../types/PncGatewayInterface"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import generateExceptionsForOperation from "./exceptions/generateExceptionsForOperation"
import performOperation from "./lib/performOperation"
import type Phase3Result from "./types/Phase3Result"
import { Phase3ResultType } from "./types/Phase3Result"

const phase3 = async (
  inputMessage: PncUpdateDataset,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): PromiseResult<Phase3Result> => {
  auditLogger.info(EventCode.HearingOutcomeReceivedPhase3)
  const correlationId = inputMessage.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  let shouldGenerateTriggers = true
  for (const operation of inputMessage.PncOperations) {
    if (operation.status === "Completed") {
      continue
    }

    const exceptions = generateExceptionsForOperation(operation.code, inputMessage)

    const operationResult = await performOperation(inputMessage, operation, pncGateway).catch((error) => error)
    if (isError(operationResult)) {
      shouldGenerateTriggers = false
      break
    }

    if (exceptions.length > 0) {
      inputMessage.Exceptions.push(...exceptions)
    }
  }

  const triggers = shouldGenerateTriggers ? generateTriggers(inputMessage, Phase.PHASE_3) : []

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId,
    outputMessage: inputMessage,
    pncOperations: [],
    triggers,
    triggerGenerationAttempted: false,
    resultType: Phase3ResultType.success
  }
}

export default phase3
