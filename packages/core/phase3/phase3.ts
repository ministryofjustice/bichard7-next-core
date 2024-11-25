import EventCode from "@moj-bichard7/common/types/EventCode"
import type AuditLogger from "../types/AuditLogger"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import type Phase3Result from "./types/Phase3Result"
import { Phase3ResultType } from "./types/Phase3Result"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import performOperation from "./lib/performOperation"
import type PncGatewayInterface from "../types/PncGatewayInterface"

const phase3 = async (
  inputMessage: PncUpdateDataset,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): PromiseResult<Phase3Result> => {
  auditLogger.info(EventCode.HearingOutcomeReceivedPhase3)

  for (const operation of inputMessage.PncOperations) {
    if (operation.status === "Completed") {
      continue
    }

    const operationResult = await performOperation(inputMessage, operation, pncGateway).catch((error) => error)
    if (isError(operationResult)) {
      break
    }
  }

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId: "",
    outputMessage: inputMessage,
    pncOperations: [],
    triggers: [],
    triggerGenerationAttempted: false,
    resultType: Phase3ResultType.success
  }
}

export default phase3
