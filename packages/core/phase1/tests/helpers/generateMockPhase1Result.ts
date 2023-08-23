import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { randomUUID } from "crypto"
import merge from "lodash.merge"
import type { Phase1SuccessResult } from "phase1/types/Phase1Result"
import { Phase1ResultType } from "phase1/types/Phase1Result"
import type { Trigger } from "phase1/types/Trigger"
import type { AnnotatedHearingOutcome, PartialAho } from "types/AnnotatedHearingOutcome"
import generateFakeAho from "phase1/tests/helpers/generateFakeAho"

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
