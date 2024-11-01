import type AuditLogGateway from "../interfaces/auditLogGateway"

class AuditLogging implements AuditLogGateway {
  createAuditLog(record: string): void {
    console.log(record)
  }
}

export default AuditLogging
