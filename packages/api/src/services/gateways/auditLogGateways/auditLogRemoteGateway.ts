import type AuditLogGateway from "../interfaces/auditLogGateway"

class AuditLogRemoteGateway implements AuditLogGateway {
  createAuditLog(record: string): void {
    console.log(record)
  }
}

export default AuditLogRemoteGateway
