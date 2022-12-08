import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type AuditLogEvent from "./AuditLogEvent"
import type { Trigger } from "./Trigger"

export type Phase1SuccessResult = {
  hearingOutcome: AnnotatedHearingOutcome
  auditLogEvents: AuditLogEvent[]
  triggers: Trigger[]
}

export type Phase1FailureResult = {
  auditLogEvents: AuditLogEvent[]
  failure: true
}

type Phase1Result = Phase1SuccessResult | Phase1FailureResult

export default Phase1Result
