import type AuditLogger from "types/AuditLogger"

const fakeAuditLogger: AuditLogger = {
  logEvent: (_action, _attributes) => Promise.resolve(),
  logError: (_description, _attributes, _error) => {}
}

export default fakeAuditLogger
