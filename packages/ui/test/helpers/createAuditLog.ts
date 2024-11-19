import axios from "axios"
import { randomUUID } from "crypto"

import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../../src/config"
import { statusOk } from "../../src/utils/http"

export default async function createAuditLog(messageId?: string) {
  const auditLog = {
    caseId: randomUUID(),
    createdBy: randomUUID(),
    externalCorrelationId: randomUUID(),
    messageHash: randomUUID(),
    messageId: messageId ?? randomUUID(),
    receivedDate: new Date().toISOString()
  }

  const response = await axios(`${AUDIT_LOG_API_URL}/messages`, {
    data: JSON.stringify(auditLog),
    headers: {
      "X-API-KEY": AUDIT_LOG_API_KEY
    },
    method: "POST"
  })

  if (!statusOk(response.status)) {
    throw Error(`Failed to create audit log for messageId ${messageId}. ${response.data}`)
  }

  return auditLog
}
