import type { AuditLogEvent } from "common/types/AuditLogEvent"
import type { AnnotatedHearingOutcome, PartialAho } from "core/common/types/AnnotatedHearingOutcome"
import type { Phase1SuccessResult } from "core/phase1/types/Phase1Result"
import { Phase1ResultType } from "core/phase1/types/Phase1Result"
import type { Trigger } from "core/phase1/types/Trigger"
import { randomUUID } from "crypto"
import merge from "lodash.merge"
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
