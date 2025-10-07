import { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"

export type PncError = {
  timestamp: Date
  pncRequestType: string
  pncErrorMessage: string
}

export const extractPncErrorsFromEvent = ({ attributes, timestamp }: AuditLogEvent) => {
  let pncErrorMessage: string | null = null

  const pncResponseMessageAttribute = attributes && attributes["PNC Response Message"]
  const hasPncResponseMessage = pncResponseMessageAttribute && typeof pncResponseMessageAttribute === "string"

  if (hasPncResponseMessage) {
    const errorMatches = /<TXT>(?<error>I\d{4}.*?)<\/TXT>/g.exec(pncResponseMessageAttribute)

    if (errorMatches && errorMatches.groups) {
      pncErrorMessage = errorMatches.groups["error"].replace(/\s+/g, " ").trim()
    }
  }

  return {
    timestamp,
    pncRequestType: (attributes && attributes["PNC Request Type"]?.toString()) ?? "Unknown",
    pncErrorMessage: pncErrorMessage ?? ""
  }
}
