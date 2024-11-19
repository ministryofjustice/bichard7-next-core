import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type AuditLogger from "../types/AuditLogger"
import type PncGatewayInterface from "../types/PncGatewayInterface"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import type Phase3Result from "./types/Phase3Result"

import handleBusinessException, { pncAsnUpdateFacadeBusinessExceptionSchema } from "./lib/handleBusinessException"
import performOperation from "./lib/performOperation"
import { Phase3ResultType } from "./types/Phase3Result"

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
      if (pncAsnUpdateFacadeBusinessExceptionSchema.safeParse(operationResult).success) {
        handleBusinessException(inputMessage, operation, operationResult)
      } else {
        // throw operationResult // TODO: Implement PNCUpdateProcessor.java:124
      }
    }
  }

  return {
    auditLogEvents: auditLogger.getEvents(),
    correlationId: "",
    outputMessage: inputMessage,
    pncOperations: [],
    resultType: Phase3ResultType.success,
    triggerGenerationAttempted: false,
    triggers: []
  }
}

export default phase3
