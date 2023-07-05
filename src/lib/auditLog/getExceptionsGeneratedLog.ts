import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type AuditLogEvent from "src/types/AuditLogEvent"
import type KeyValuePair from "src/types/KeyValuePair"
import getAuditLogEvent from "./getAuditLogEvent"
import { AuditLogEventSource, AuditLogEventType } from "src/types/AuditLogEvent"
import EventCategory from "../../types/EventCategory"

const getExceptionsGeneratedLog = (hearingOutcome: AnnotatedHearingOutcome): AuditLogEvent => {
  const errorDetails = hearingOutcome.Exceptions.reduce((acc: KeyValuePair<string, unknown>, exception, i) => {
    acc[`Error ${i + 1} Details`] = exception.code + "||" + exception.path.slice(-1)

    return acc
  }, {})

  const attributes = {
    "Exception Type": hearingOutcome.Exceptions[0].code,
    "Number Of Errors": hearingOutcome.Exceptions.length,
    ...errorDetails
  }

  return getAuditLogEvent(
    AuditLogEventType.EXCEPTIONS_GENERATED.code,
    EventCategory.information,
    AuditLogEventType.EXCEPTIONS_GENERATED.type,
    AuditLogEventSource.CoreHandler,
    attributes
  )
}

export default getExceptionsGeneratedLog
