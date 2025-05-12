import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"

import { XMLParser } from "fast-xml-parser"

const convertXmlAuditLogs = (logs: string[]): AuditLogEvent[] => {
  return logs.map((logXml) => {
    const parser = new XMLParser()
    const rawParsedObj = parser.parse(logXml)

    const timestamp = rawParsedObj.logEvent.eventDateTime
    const category = rawParsedObj.logEvent.eventCategory
    const eventType = rawParsedObj.logEvent.eventType
    const eventSource = rawParsedObj.logEvent.componentID
    const attributes = rawParsedObj.logEvent.nameValuePairs.nameValuePair.reduce(
      (acc: Record<string, string>, nvp: { name: string; value: string }) => {
        acc[nvp.name] = nvp.value
        if (nvp.name === "Force Owner") {
          acc[nvp.name] = String(nvp.value).padStart(6, "0")
        }

        return acc
      },
      {}
    )
    const eventCode = attributes.eventCode
    delete attributes.eventCode
    const user = attributes.user ? { user: attributes.user } : {}
    delete attributes.user
    delete attributes.auditLogVersion

    return { timestamp, category, eventCode, eventType, eventSource, attributes, ...user } as AuditLogEvent
  })
}

export default convertXmlAuditLogs
