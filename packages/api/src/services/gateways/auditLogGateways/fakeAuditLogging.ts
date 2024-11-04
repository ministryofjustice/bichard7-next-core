import type AuditLogGateway from "../interfaces/auditLogGateway"

class FakeAuditLogging implements AuditLogGateway {
  private readonly auditLog: Array<string> = []

  createAuditLog(record: string): void {
    this.auditLog.push(record)
  }
}

export default FakeAuditLogging
