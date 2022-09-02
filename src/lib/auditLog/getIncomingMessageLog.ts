import type { HearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import type AuditLogEvent from "src/types/AuditLogEvent"
import type KeyValuePair from "src/types/KeyValuePair"
import getOffenceCode from "src/lib/offence/getOffenceCode"
import getAuditLogEvent from "./getAuditLogEvent"

const getOffenceDetails = (offences: Offence[]): KeyValuePair<string, string> => {
  const offenceDetails: KeyValuePair<string, string> = {}
  offences.forEach((offence, i) => {
    const offenceCode = getOffenceCode(offence)
    const offenceSequence = offence.CourtOffenceSequenceNumber.toString().padStart(3, "0")
    const offenceResult = offence.Result.map((result) => result.CJSresultCode).join(",")
    const offenceDetail = offenceCode + "||" + offenceSequence + "||" + offenceResult
    offenceDetails[`Offence ${i + 1} Details`] = offenceDetail
  })
  return offenceDetails
}

const getIncomingMessageLog = (
  hearingOutcome: HearingOutcome,
  originalMessage: string,
  messageType: string
): AuditLogEvent => {
  const attributes = {
    "Date Of Hearing": hearingOutcome.Hearing.DateOfHearing,
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

  return getAuditLogEvent("information", "Input message received", "CoreHandler", attributes)
}

export default getIncomingMessageLog
