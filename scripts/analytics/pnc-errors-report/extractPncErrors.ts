import { isError } from "@moj-bichard7/e2e-tests/utils/isError"
import { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"

const extractPncErrors = (pncResponseReceivedEvents: AuditLogEvent[] | Error) => {
  if (isError(pncResponseReceivedEvents)) {
    throw pncResponseReceivedEvents
  }

  const pncErrors = pncResponseReceivedEvents
    .map(({ timestamp, attributes }) => {
      let pncErrorMessage: string | null = null

      const pncResponseMessageAttribute = attributes && attributes["PNC Response Message"]
      const hasPncResponseMessage = pncResponseMessageAttribute && typeof pncResponseMessageAttribute === "string"

      if (hasPncResponseMessage) {
        const errorMatches = /<TXT>(?<error>I.*?)<\/TXT>/g.exec(pncResponseMessageAttribute)

        if (errorMatches && errorMatches.groups) {
          pncErrorMessage = errorMatches.groups["error"].replace(/\s+/g, " ").trim()
        }
      }

      return {
        timestamp,
        pncRequestType: attributes && attributes["PNC Request Type"],
        pncErrorMessage
      }
    })
    .filter((event) => event.pncErrorMessage)

  console.log(`\nTotal number of PNC errors: ${pncErrors.length}`)

  return pncErrors
}

export default extractPncErrors
