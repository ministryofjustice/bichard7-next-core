import getOffenceCode from "src/lib/offence/getOffenceCode"
import type { HearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import type AuditLogEvent from "src/types/AuditLogEvent"
import type KeyValuePair from "src/types/KeyValuePair"
import getAuditLogEvent from "./getAuditLogEvent"
import EventCategory from "../../types/EventCategory"
import { AuditLogEventSource, AuditLogEventType } from "src/types/AuditLogEvent"

const getOffenceDetails = (offences: Offence[]): KeyValuePair<string, string> =>
  offences.reduce((acc: KeyValuePair<string, string>, offence, i) => {
    const offenceCode = getOffenceCode(offence)
    const offenceSequence = offence.CourtOffenceSequenceNumber.toString().padStart(3, "0")
    const offenceResult = offence.Result.map((result) => result.CJSresultCode).join(",")
    const offenceDetail = offenceCode + "||" + offenceSequence + "||" + offenceResult
    acc[`Offence ${i + 1} Details`] = offenceDetail
    return acc
  }, {})

const getIncomingMessageLog = (
  hearingOutcome: HearingOutcome,
  originalMessage: string,
  messageType: string
): AuditLogEvent => {
  const attributes = {
    "Date Of Hearing": hearingOutcome.Hearing.DateOfHearing.toISOString().split("T")[0],
    ...(!!hearingOutcome.Hearing.TimeOfHearing && {
      "Time Of Hearing": hearingOutcome.Hearing.TimeOfHearing
    }),
    ASN: hearingOutcome.Case.HearingDefendant.ArrestSummonsNumber,
    "Number Of Offences": hearingOutcome.Case.HearingDefendant.Offence.length,
    "Message Type": messageType,
    "Message Size": new TextEncoder().encode(originalMessage).length,
    "Court Hearing Location": hearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode,
    PTIURN: hearingOutcome.Case.PTIURN,
    "PSA Code": hearingOutcome.Hearing.CourtHouseCode,
    ...(!!hearingOutcome.Case.ForceOwner?.OrganisationUnitCode && {
      "Force Owner": hearingOutcome.Case.ForceOwner?.OrganisationUnitCode
    }),
    ...getOffenceDetails(hearingOutcome.Case.HearingDefendant.Offence)
  }

  return getAuditLogEvent(
    AuditLogEventType.HEARING_OUTCOME_DETAILS.code,
    EventCategory.information,
    AuditLogEventType.HEARING_OUTCOME_DETAILS.type,
    AuditLogEventSource.CoreHandler,
    attributes
  )
}

export default getIncomingMessageLog
