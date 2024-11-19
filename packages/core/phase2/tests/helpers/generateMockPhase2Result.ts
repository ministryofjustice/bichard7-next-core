import { randomUUID } from "crypto"
import merge from "lodash.merge"

import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type Phase2Result from "../../types/Phase2Result"

import { Phase2ResultType } from "../../types/Phase2Result"
import generateFakePncUpdateDataset from "../fixtures/helpers/generateFakePncUpdateDataset"

const generateMockPhase2Result = (
  input: Partial<Phase2Result> = { triggerGenerationAttempted: false }
): Phase2Result => {
  const correlationId = input.correlationId ?? randomUUID()
  const ahoCorrelationId = {
    AnnotatedHearingOutcome: { HearingOutcome: { Hearing: { SourceReference: { UniqueID: correlationId } } } }
  } as Partial<PncUpdateDataset>
  const outputMessage = merge(generateFakePncUpdateDataset(input.outputMessage ?? {}), ahoCorrelationId)
  outputMessage.PncOperations ??= []

  return {
    auditLogEvents: input.auditLogEvents ?? [],
    correlationId,
    outputMessage,
    resultType: input.resultType ?? Phase2ResultType.success,
    triggerGenerationAttempted: !!input.triggerGenerationAttempted,
    triggers: input.triggers ?? []
  }
}

export default generateMockPhase2Result
