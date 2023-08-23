import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import { AuditLogEventOptions, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import EventCategory from "phase1/types/EventCategory"
import getAuditLogEvent from "phase1/lib/auditLog/getAuditLogEvent"

const getExceptionsGeneratedLog = (hearingOutcome: AnnotatedHearingOutcome): AuditLogEvent => {
  const errorDetails = hearingOutcome.Exceptions.reduce((acc: Record<string, unknown>, exception, i) => {
    acc[`Error ${i + 1} Details`] = exception.code + "||" + exception.path.slice(-1)

    return acc
  }, {})

  const attributes = {
    "Exception Type": hearingOutcome.Exceptions[0].code,
    "Number Of Errors": hearingOutcome.Exceptions.length,
    ...errorDetails
  }

  return getAuditLogEvent(
    AuditLogEventOptions.exceptionsGenerated,
    EventCategory.information,
    AuditLogEventSource.CoreHandler,
    attributes
  )
}

export default getExceptionsGeneratedLog
