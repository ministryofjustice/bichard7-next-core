import Trigger from "../../../src/services/entities/Trigger"
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuid } from "uuid"
import AuditLogEvent from "../../../../bichard7-next-audit-logging/src/shared-types/src/AuditLogEvent"

type GeneratedEvents = {
  events: AuditLogEvent[]
  valueLookup: Record<string, unknown>[]
}

export default function generateAuditLogEvents(
  resolvedTriggers: Trigger[],
  triggerCodes: string[],
  messageId: string,
  aho: string,
  resolverUsername: string
): GeneratedEvents {
  const events: AuditLogEvent[] = []
  const triggerCodesResolved = triggerCodes.filter((triggerCode) =>
    resolvedTriggers.some((r) => r.triggerCode === triggerCode)
  )
  const triggerDetailsObj = triggerCodesResolved.reduce((acc: Record<string, string>, triggerCode, index) => {
    acc[`Trigger ${index} Details`] = triggerCode
    return acc
  }, {})

  events.push({
    attributes: {
      "Number Of Triggers": `${triggerCodesResolved.length}`,
      ...triggerDetailsObj,
      "User ID": resolverUsername
    },
    category: "information",
    eventSource: "ErrorHandlerScreenFlow",
    eventType: "Trigger marked as resolved by user",
    timestamp: new Date().toISOString()
  } as unknown as AuditLogEvent)

  const ahoValueLookup = {
    id: uuid(),
    isCompressed: false,
    messageId,
    value: aho,
    _: "_"
  }

  events.push({
    attributes: {
      "Original Hearing Outcome / PNC Update Dataset": {
        valueLookup: ahoValueLookup.id
      },
      ...triggerCodesResolved.reduce((acc: Record<string, string>, triggerCode, index) => {
        acc[`Trigger Code ${index.toString().padStart(2, "0")}`] = triggerCode
        return acc
      }, {})
    },
    category: "information",
    eventSource: "ErrorHandlerScreenFlow",
    eventType: "Trigger Instances resolved",
    timestamp: new Date().toISOString()
  } as unknown as AuditLogEvent)

  events.push({
    category: "information",
    eventSource: "CustomScript_TriggerResolver",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    eventType: process.env.TRIGGER_NOTE!,
    timestamp: new Date().toISOString()
  } as unknown as AuditLogEvent)

  return {
    events,
    valueLookup: [ahoValueLookup]
  }
}
