import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type AuditLogEvent from "src/types/AuditLogEvent"
import type KeyValuePair from "src/types/KeyValuePair"
import getAuditLogEvent from "./getAuditLogEvent"

const getHearingOutcomePassedToErrorListLog = (hearingOutcome: AnnotatedHearingOutcome): AuditLogEvent => {
  const errorDetails = hearingOutcome.Exceptions.reduce((acc: KeyValuePair<string, unknown>, exception, i) => {
    acc[`Error ${i + 1} Details`] = exception.code + "||" + exception.path.slice(-1)

    return acc
  }, {})

  const attributes = {
    ASN: hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber,
    "Exception Type": hearingOutcome.Exceptions[0].code,
    "Number Of Errors": hearingOutcome.Exceptions.length.toString(),
    ...errorDetails
  }

  return getAuditLogEvent("exceptions.generated", "information", "Exceptions generated", "CoreHandler", attributes)
}

export default getHearingOutcomePassedToErrorListLog
