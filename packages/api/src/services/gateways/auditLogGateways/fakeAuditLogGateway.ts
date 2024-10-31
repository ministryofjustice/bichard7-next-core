import type AuditLogGateway from "../interfaces/auditLogGateway"

class FakeAuditLogGateway implements AuditLogGateway {
  private readonly auditLog: Array<string> = []

  createAuditLog(record: string): void {
    this.auditLog.push(record)
  }
}

export default FakeAuditLogGateway
