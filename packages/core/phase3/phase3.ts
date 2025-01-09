import type { Result } from "@moj-bichard7/common/types/Result"

import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"

import type AuditLogger from "../types/AuditLogger"
import type PncGatewayInterface from "../types/PncGatewayInterface"
import type { Operation, PncUpdateDataset } from "../types/PncUpdateDataset"
import type Phase3Result from "./types/Phase3Result"
import type PncUpdateRequest from "./types/PncUpdateRequest"
import type PncUpdateRequestGenerator from "./types/PncUpdateRequestGenerator"

import generateExceptionLogAttributes from "../lib/auditLog/generateExceptionLogAttributes"
import generateTriggersLogAttributes from "../lib/auditLog/generateTriggersLogAttributes"
import generateTriggers from "../lib/triggers/generateTriggers"
import Phase from "../types/Phase"
import { PncOperation } from "../types/PncOperation"
import performOperation from "./lib/performOperation"
import disposalUpdatedGenerator from "./lib/pncUpdateRequestGenerators/disposalUpdatedGenerator"
import { normalDisposalGenerator } from "./lib/pncUpdateRequestGenerators/normalDisposalGenerator"
import penaltyHearingGenerator from "./lib/pncUpdateRequestGenerators/penaltyHearingGenerator"
import { remandGenerator } from "./lib/pncUpdateRequestGenerators/remandGenerator"
import sentenceDeferredGenerator from "./lib/pncUpdateRequestGenerators/sentenceDeferredGenerator"
import { Phase3ResultType } from "./types/Phase3Result"

const pncUpdateRequestGenerator: { [T in PncOperation]: PncUpdateRequestGenerator<T> } = {
  [PncOperation.DISPOSAL_UPDATED]: disposalUpdatedGenerator,
  [PncOperation.NORMAL_DISPOSAL]: normalDisposalGenerator,
  [PncOperation.PENALTY_HEARING]: penaltyHearingGenerator,
  [PncOperation.REMAND]: remandGenerator,
  [PncOperation.SENTENCE_DEFERRED]: sentenceDeferredGenerator
}

const generatePncUpdateRequest = <T extends PncOperation>(
  pncUpdateDataset: PncUpdateDataset,
  operation: Operation<T>
): Result<PncUpdateRequest> => pncUpdateRequestGenerator[operation.code as T](pncUpdateDataset, operation)

const phase3 = async (
  inputMessage: PncUpdateDataset,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): Promise<Phase3Result> => {
  const correlationId = inputMessage.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  const incompleteOperations = inputMessage.PncOperations.filter((operation) => operation.status !== "Completed")

  const hasErrors = incompleteOperations.some((operation) => isError(generatePncUpdateRequest(inputMessage, operation)))
  if (hasErrors) {
    return {
      auditLogEvents: auditLogger.getEvents(),
      correlationId,
      outputMessage: inputMessage,
      triggers: [],
      triggerGenerationAttempted: false,
      resultType: Phase3ResultType.exceptions
    }
  }

  for (const operation of incompleteOperations) {
    const operationResult = await performOperation(inputMessage, operation, pncGateway).catch((error) => error)
    if (isError(operationResult)) {
      auditLogger.info(EventCode.ExceptionsGenerated, generateExceptionLogAttributes(inputMessage))

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
