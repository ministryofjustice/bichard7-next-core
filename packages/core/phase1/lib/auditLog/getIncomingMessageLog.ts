import type { HearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import getOffenceCode from "../offence/getOffenceCode"

const getOffenceDetails = (offences: Offence[]): Record<string, string> =>
  offences.reduce((acc: Record<string, string>, offence, i) => {
    const offenceCode = getOffenceCode(offence)
    const offenceSequence = offence.CourtOffenceSequenceNumber.toString().padStart(3, "0")
    const offenceResult = offence.Result.map((result) => result.CJSresultCode).join(",")
    const offenceDetail = offenceCode + "||" + offenceSequence + "||" + offenceResult
    acc[`Offence ${i + 1} Details`] = offenceDetail
    return acc
  }, {})

const getIncomingMessageLogAttributes = (hearingOutcome: HearingOutcome): Record<string, unknown> => ({
  "Date Of Hearing": hearingOutcome.Hearing.DateOfHearing.toISOString().split("T")[0],
  ...(!!hearingOutcome.Hearing.TimeOfHearing && {
    "Time Of Hearing": hearingOutcome.Hearing.TimeOfHearing
  }),
  ASN: hearingOutcome.Case.HearingDefendant.ArrestSummonsNumber,
  "Number Of Offences": hearingOutcome.Case.HearingDefendant.Offence.length,
  "Court Hearing Location": hearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode,
  PTIURN: hearingOutcome.Case.PTIURN,
  "PSA Code": hearingOutcome.Hearing.CourtHouseCode,
  ...(!!hearingOutcome.Case.ForceOwner?.OrganisationUnitCode && {
    "Force Owner": hearingOutcome.Case.ForceOwner?.OrganisationUnitCode
  }),
  ...getOffenceDetails(hearingOutcome.Case.HearingDefendant.Offence)
})

export default getIncomingMessageLogAttributes
