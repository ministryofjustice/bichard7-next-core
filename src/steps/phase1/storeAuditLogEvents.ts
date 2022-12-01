import type AuditLogEvent from "src/types/AuditLogEvent"

const storeAuditLogEvents = (auditLogs: AuditLogEvent[]) => {
  console.log(auditLogs)
}

export default storeAuditLogEvents
