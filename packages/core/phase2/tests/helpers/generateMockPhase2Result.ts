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
    correlationId,
    outputMessage,
    auditLogEvents: input.auditLogEvents ?? [],
    triggers: input.triggers ?? [],
    triggerGenerationAttempted: !!input.triggerGenerationAttempted,
    resultType: input.resultType ?? Phase2ResultType.success
  }
}

export default generateMockPhase2Result
