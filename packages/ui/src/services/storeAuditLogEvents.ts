import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../config"
import { statusOk } from "../utils/http"

const storeAuditLogEvents = async (
  messageIdOrUsername: string,
  events: AuditLogEvent[],
  route: "users" | "messages"
): Promise<Error | void> => {
  if (events.length === 0) {
    return
  }

  const controller = new AbortController()
  const timeoutMs = 3000
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${AUDIT_LOG_API_URL}/${route}/${messageIdOrUsername}/events`, {
      method: "POST",
      headers: {
        "X-API-Key": AUDIT_LOG_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(events),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!statusOk(response.status)) {
      const errorData = await response.text()
      return new Error(`Failed to create audit logs: ${errorData}`)
    }
  } catch (err) {
    clearTimeout(timeoutId)

    if (err instanceof Error && err.name === "AbortError") {
      return new Error(`Failed to create audit logs: Request timed out after ${timeoutMs}ms`)
    }

    return new Error(`Failed to create audit logs: ${err}`)
  }
}

export const storeUserAuditLogEvents = async (userName: string, events: AuditLogEvent[]) =>
  storeAuditLogEvents(userName, events, "users")

export const storeMessageAuditLogEvents = async (messageId: string, events: AuditLogEvent[]) =>
  storeAuditLogEvents(messageId, events, "messages")
