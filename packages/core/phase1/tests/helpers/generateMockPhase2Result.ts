import { randomUUID } from "crypto"
import merge from "lodash.merge"
import generateFakePncUpdateDataset from "../../../phase2/tests/fixtures/helpers/generateFakePncUpdateDataset"
import type Phase2Result from "../../../phase2/types/Phase2Result"
import { Phase2ResultType } from "../../../phase2/types/Phase2Result"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"

const generateMockPhase2Result = (input: Partial<Phase2Result> = { triggersGenerated: false }): Phase2Result => {
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
    triggersGenerated: !!input.triggersGenerated,
    resultType: input.resultType ?? Phase2ResultType.success
  }
}

export default generateMockPhase2Result
