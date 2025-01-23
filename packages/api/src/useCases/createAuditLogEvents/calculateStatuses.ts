import type { DynamoAuditLog } from "../../types/AuditLog"
import type { DynamoAuditLogEvent } from "../../types/AuditLogEvent"

import CalculateMessageStatusUseCase from "../../services/gateways/dynamo/AuditLogDynamoGateway/CalculateMessageStatusUseCase"

export default (auditLog: DynamoAuditLog, allEvents: DynamoAuditLogEvent[]): Partial<DynamoAuditLog> => {
  return new CalculateMessageStatusUseCase(auditLog.status, allEvents).call()
}
