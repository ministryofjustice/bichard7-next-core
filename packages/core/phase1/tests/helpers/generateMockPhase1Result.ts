import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { randomUUID } from "crypto"
import merge from "lodash.merge"
import type { AnnotatedHearingOutcome, PartialAho } from "../../../types/AnnotatedHearingOutcome"
import generateFakeAho from "../../tests/helpers/generateFakeAho"
import { Phase1ResultType, type Phase1SuccessResult } from "../../types/Phase1Result"
import type { Trigger } from "../../types/Trigger"

type PartialPhase1SuccessResult = {
  correlationId?: string
  hearingOutcome?: PartialAho
  auditLogEvents?: AuditLogEvent[]
  triggers?: Trigger[]
  resultType?: Phase1ResultType.success | Phase1ResultType.exceptions
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
    resultType: Phase1ResultType.success
  }
}

export default generateMockPhase1Result
