import type AuditLogEvent from "src/types/AuditLogEvent"
import type KeyValuePair from "src/types/KeyValuePair"
import type { Trigger } from "src/types/Trigger"
import getAuditLogEvent from "./getAuditLogEvent"
import EventCategory from "../../types/EventCategory"
import { AuditLogEventSource, AuditLogEventType } from "src/types/AuditLogEvent"

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
    AuditLogEventType.TRIGGER_GENERATED.code,
    EventCategory.information,
    AuditLogEventType.TRIGGER_GENERATED.type,
    AuditLogEventSource.CoreHandler,
    attributes
  )
}

export default getTriggersGeneratedLog
