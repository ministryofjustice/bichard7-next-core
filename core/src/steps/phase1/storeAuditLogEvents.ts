import axios from "axios"
import type Phase1Result from "src/types/Phase1Result"

const auditLogApiUrl = process.env.AUDIT_LOG_API_URL
const auditLogApiKey = process.env.AUDIT_LOG_API_KEY

const storeAuditLogEvents = async (phase1Result: Phase1Result): Promise<void> => {
  if (!auditLogApiUrl || !auditLogApiKey) {
    throw new Error("AUDIT_LOG_API_URL and AUDIT_LOG_API_KEY environment variables must be set")
  }

  if (phase1Result.correlationId && phase1Result.auditLogEvents.length > 0) {
    await axios.post(`${auditLogApiUrl}/messages/${phase1Result.correlationId}/events`, phase1Result.auditLogEvents, {
      headers: { "X-Api-Key": auditLogApiKey }
    })
  }
}

export default storeAuditLogEvents
