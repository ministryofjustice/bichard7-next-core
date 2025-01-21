import type { ApiAuditLogEvent } from "../../../../types/AuditLogEvent"

export default (event: ApiAuditLogEvent): boolean => event.eventCode === "exceptions.generated"
