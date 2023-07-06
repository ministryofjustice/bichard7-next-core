import type { AuditLogEvent } from "src/types/AuditLogEvent"
import type KeyValuePair from "src/types/KeyValuePair"
import type { Trigger } from "src/types/Trigger"
import getAuditLogEvent from "./getAuditLogEvent"
import EventCategory from "../../types/EventCategory"
import { AuditLogEventSource, AuditLogEventOptions } from "src/types/AuditLogEvent"

const getTriggersGeneratedLog = (triggers: Trigger[], hasExceptions: boolean): AuditLogEvent => {
  const triggerDetails = triggers.reduce((acc: KeyValuePair<string, unknown>, trigger, i) => {
    acc[`Trigger ${i + 1} Details`] = trigger.code

    return acc
  }, {})

  const attributes = {
    "Number of Triggers": triggers.length,
    "Trigger and Exception Flag": hasExceptions,
    ...triggerDetails
  }

  return getAuditLogEvent(
    AuditLogEventOptions.triggerGenerated,
    EventCategory.information,
    AuditLogEventSource.CoreHandler,
    attributes
  )
}

export default getTriggersGeneratedLog
