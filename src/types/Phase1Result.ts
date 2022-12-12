import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type AuditLogEvent from "./AuditLogEvent"
import type { Trigger } from "./Trigger"

export enum Phase1ResultType {
  success,
  failure,
  ignored
}

export type Phase1SuccessResult = {
  correlationId: string
  hearingOutcome: AnnotatedHearingOutcome
  auditLogEvents: AuditLogEvent[]
  triggers: Trigger[]
  resultType: Phase1ResultType.success
}

export type Phase1FailureResult = {
  correlationId?: string
  auditLogEvents: AuditLogEvent[]
  resultType: Phase1ResultType.failure
}

export type Phase1IgnoredResult = {
  correlationId: string
  auditLogEvents: AuditLogEvent[]
  resultType: Phase1ResultType.ignored
}

type Phase1Result = Phase1SuccessResult | Phase1FailureResult | Phase1IgnoredResult

export default Phase1Result
