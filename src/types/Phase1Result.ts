import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type { AuditLogEvent } from "./AuditLogEvent"
import type { Trigger } from "./Trigger"

export enum Phase1ResultType {
  success = "success",
  exceptions = "exceptions",
  failure = "failure",
  ignored = "ignored"
}

export type Phase1SuccessResult = {
  correlationId: string
  hearingOutcome: AnnotatedHearingOutcome
  auditLogEvents: AuditLogEvent[]
  triggers: Trigger[]
  resultType: Phase1ResultType.success | Phase1ResultType.exceptions | Phase1ResultType.ignored
}

export type Phase1FailureResult = {
  correlationId?: string
  auditLogEvents: AuditLogEvent[]
  resultType: Phase1ResultType.failure
}

type Phase1Result = Phase1SuccessResult | Phase1FailureResult

export default Phase1Result
