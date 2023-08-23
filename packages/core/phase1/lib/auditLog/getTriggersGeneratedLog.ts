import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { AuditLogEventOptions, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import type { Trigger } from "phase1/types/Trigger"
import EventCategory from "phase1/types/EventCategory"
import getAuditLogEvent from "phase1/lib/auditLog/getAuditLogEvent"

const getTriggersGeneratedLog = (triggers: Trigger[], hasExceptions: boolean): AuditLogEvent => {
  const triggerDetails = triggers.reduce((acc: Record<string, unknown>, trigger, i) => {
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
