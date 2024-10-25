import axios from "axios"
import { randomUUID } from "crypto"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../../src/config"
import { statusOk } from "../../src/utils/http"

export default async function createAuditLog(messageId?: string) {
  const auditLog = {
    messageId: messageId ?? randomUUID(),
    caseId: randomUUID(),
    externalCorrelationId: randomUUID(),
    receivedDate: new Date().toISOString(),
    createdBy: randomUUID(),
    messageHash: randomUUID()
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
