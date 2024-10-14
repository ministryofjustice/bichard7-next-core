import type { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../config"
import axios from "axios"
import { statusOk } from "../utils/http"

const storeAuditLogEvents = async (
  messageIdOrUsername: string,
  events: AuditLogEvent[],
  route: "users" | "messages"
) => {
  if (events.length === 0) {
    return
  }

  return axios({
    url: `${AUDIT_LOG_API_URL}/${route}/${messageIdOrUsername}/events`,
    method: "POST",
    headers: {
      "X-API-Key": AUDIT_LOG_API_KEY
    },
    data: JSON.stringify(events)
  })
    .then((response) => {
      if (!statusOk(response.status)) {
        throw Error(`Failed to create audit logs: ${response.data}`)
      }
    })
    .catch((err) => {
      throw Error(`Failed to create audit logs: ${err}`)
    })
}

export const storeUserAuditLogEvents = (userName: string, events: AuditLogEvent[]) =>
  storeAuditLogEvents(userName, events, "users")

export const storeMessageAuditLogEvents = (messageId: string, events: AuditLogEvent[]) =>
  storeAuditLogEvents(messageId, events, "messages")
