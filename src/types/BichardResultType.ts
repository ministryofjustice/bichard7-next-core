import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type AuditLogEvent from "./AuditLogEvent"
import type { Trigger } from "./Trigger"

type BichardResultType = {
  triggers: Trigger[]
  hearingOutcome: AnnotatedHearingOutcome
  events: AuditLogEvent[]
}

export default BichardResultType
