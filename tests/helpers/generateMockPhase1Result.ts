import { randomUUID } from "crypto"
import merge from "lodash.merge"
import type { AnnotatedHearingOutcome, PartialAho } from "src/types/AnnotatedHearingOutcome"
import type { AuditLogEvent } from "src/types/AuditLogEvent"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import { Phase1ResultType } from "src/types/Phase1Result"
import type { Trigger } from "src/types/Trigger"
import generateFakeAho from "./generateFakeAho"

type PartialPhase1SuccessResult = {
  correlationId?: string
  hearingOutcome?: PartialAho
  auditLogEvents?: AuditLogEvent[]
  triggers?: Trigger[]
  resultType?: Phase1ResultType.success | Phase1ResultType.exceptions | Phase1ResultType.ignored
}

const generateMockPhase1Result = (input: PartialPhase1SuccessResult = {}): Phase1SuccessResult => {
  const correlationId = input.correlationId ?? randomUUID()
  const ahoCorrelationId = {
    AnnotatedHearingOutcome: { HearingOutcome: { Hearing: { SourceReference: { UniqueID: correlationId } } } }
  } as Partial<AnnotatedHearingOutcome>
  const hearingOutcome = merge(generateFakeAho(input.hearingOutcome ?? {}), ahoCorrelationId)

  return {
    correlationId,
    hearingOutcome,
    auditLogEvents: input.auditLogEvents ?? [],
    triggers: input.triggers ?? [],
    resultType: input.resultType ?? Phase1ResultType.success
  }
}

export default generateMockPhase1Result
