import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"

import axios from "axios"

import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../config"
import { statusOk } from "../utils/http"

const storeAuditLogEvents = async (
  messageIdOrUsername: string,
  events: AuditLogEvent[],
  route: "messages" | "users"
) => {
  if (events.length === 0) {
    return
  }

  return axios({
    data: JSON.stringify(events),
    headers: {
      "X-API-Key": AUDIT_LOG_API_KEY
    },
    method: "POST",
    url: `${AUDIT_LOG_API_URL}/${route}/${messageIdOrUsername}/events`
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
