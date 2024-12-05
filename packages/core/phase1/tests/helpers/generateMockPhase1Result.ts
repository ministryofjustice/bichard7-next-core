import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"

import { randomUUID } from "crypto"
import merge from "lodash.merge"

import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { Trigger } from "../../../types/Trigger"
import type Phase1Result from "../../types/Phase1Result"
import type { PartialAho } from "./PartialAho"

import generateFakeAho from "../../tests/helpers/generateFakeAho"
import { Phase1ResultType } from "../../types/Phase1Result"

type PartialPhase1Result = {
  auditLogEvents?: AuditLogEvent[]
  correlationId?: string
  hearingOutcome?: PartialAho
  resultType?: Phase1ResultType.exceptions | Phase1ResultType.success
  triggers?: Trigger[]
}

const generateMockPhase1Result = (input: PartialPhase1Result = {}): Phase1Result => {
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
