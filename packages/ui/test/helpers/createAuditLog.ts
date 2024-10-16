import { v4 as uuid } from "uuid"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../../src/config"
import axios from "axios"
import { statusOk } from "../../src/utils/http"

export default async function createAuditLog(messageId?: string) {
  const auditLog = {
    messageId: messageId ?? uuid(),
    caseId: uuid(),
    externalCorrelationId: uuid(),
    receivedDate: new Date().toISOString(),
    createdBy: uuid(),
    messageHash: uuid()
  }

  const response = await axios(`${AUDIT_LOG_API_URL}/messages`, {
    method: "POST",
    headers: {
      "X-API-KEY": AUDIT_LOG_API_KEY
    },
    data: JSON.stringify(auditLog)
  })

  if (!statusOk(response.status)) {
    throw Error(`Failed to create audit log for messageId ${messageId}. ${response.data}`)
  }

  return auditLog
}
