import type { ApiAuditLogEvent, DynamoAuditLogEvent } from "../../types/AuditLogEvent"

import shouldLogForAutomationReport from "../../services/gateways/dynamo/AuditLogDynamoGateway/shouldLogForAutomationReport"
import shouldLogForTopExceptionsReport from "../../services/gateways/dynamo/AuditLogDynamoGateway/shouldLogForTopExceptionsReport"

const calculateAuditLogEventIndices = (
  event: ApiAuditLogEvent
): Pick<DynamoAuditLogEvent, "_automationReport" | "_topExceptionsReport"> => ({
  _automationReport: shouldLogForAutomationReport(event) ? 1 : 0,
  _topExceptionsReport: shouldLogForTopExceptionsReport(event) ? 1 : 0
})

export default calculateAuditLogEventIndices
