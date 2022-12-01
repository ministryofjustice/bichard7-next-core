import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type AuditLogEvent from "./AuditLogEvent"
import type { Trigger } from "./Trigger"

type BichardResultType = {
  auditLogEvents: AuditLogEvent[]
  hearingOutcome: AnnotatedHearingOutcome
  triggers: Trigger[]
}

export default BichardResultType
