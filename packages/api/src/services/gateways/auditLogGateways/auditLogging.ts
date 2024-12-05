import type AuditLogGateway from "../interfaces/auditLogGateway"

// TODO: See how we can reuse this packages/core/comparison/lib/DynamoGateway.ts
class AuditLogging implements AuditLogGateway {
  createAuditLog(record: string): void {
    console.log(record)
  }
}

export default AuditLogging
