import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../config"
import { statusOk } from "../utils/http"

const storeAuditLogEvents = async (
  messageIdOrUsername: string,
  events: AuditLogEvent[],
  route: "users" | "messages"
) => {
  if (events.length === 0) {
    return
  }

  return fetch(`${AUDIT_LOG_API_URL}/${route}/${messageIdOrUsername}/events`, {
    method: "POST",
    headers: {
      "X-API-Key": AUDIT_LOG_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(events)
  })
    .then(async (response) => {
      if (!statusOk(response.status)) {
        const errorData = await response.text()
        throw new Error(`Failed to create audit logs: ${errorData}`)
      }
    })
    .catch((err) => {
      throw new Error(`Failed to create audit logs: ${err}`)
    })
}

export const storeUserAuditLogEvents = (userName: string, events: AuditLogEvent[]) =>
  storeAuditLogEvents(userName, events, "users")

export const storeMessageAuditLogEvents = (messageId: string, events: AuditLogEvent[]) =>
  storeAuditLogEvents(messageId, events, "messages")
