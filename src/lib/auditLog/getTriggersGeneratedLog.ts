import type AuditLogEvent from "src/types/AuditLogEvent"
import type KeyValuePair from "src/types/KeyValuePair"
import type { Trigger } from "src/types/Trigger"
import createAuditLogEvent from "./createAuditLogEvent"

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

  return createAuditLogEvent("triggers.generated", "information", "Triggers generated", "CoreHandler", attributes)
}

export default getTriggersGeneratedLog
