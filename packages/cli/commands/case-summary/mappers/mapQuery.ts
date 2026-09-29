import type { AsnQueryResponse, DisposalResult, Offence } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { ErrorResponse } from "@moj-bichard7/core/types/leds/ErrorResponse"
import type Metadata from "../types/Metadata"
import type SensitiveFn from "../types/SensitiveFn"
import { getCourtDetailsByLjaCode } from "../utils/courtDetails"
import getOffenceCodeDetails from "../utils/getOffenceCodeDetails"
import getResultCodeDetails from "../utils/getResultCodeDetails"

const mapDisposalResult = (disposalResult: DisposalResult, disposalResultIndex: number, sensitive: SensitiveFn) => ({
  "Disposal Result": `#${disposalResultIndex + 1}`,
  "Disposal code": getResultCodeDetails(disposalResult.disposalCode),
  "Disposal text": sensitive(disposalResult.disposalText),
  "Effective date": disposalResult.disposalEffectiveDate,
  Fine: disposalResult.disposalFine
    ? `${disposalResult.disposalFine.amount} ${disposalResult.disposalFine.units}`
    : undefined,
  Duration: disposalResult.disposalDuration
    ? `${disposalResult.disposalDuration.count} ${disposalResult.disposalDuration.units}`
    : undefined,
  Qualifiers: disposalResult.disposalQualifiers,
  "Qualifier duration": disposalResult.disposalQualifierDuration
    ? `${disposalResult.disposalQualifierDuration.count} ${disposalResult.disposalQualifierDuration.units}`
    : undefined
})

const mapOffence = async (offence: Offence, offenceIndex: number, sensitive: SensitiveFn) => {
  const offenceStartTime = offence.offenceStartTime ? ` ${offence.offenceStartTime}` : ""
  const offenceStartDateTime = `${offence.offenceStartDate}${offenceStartTime}`
  let offenceEndDateTime = undefined
  if (offence.offenceEndDate) {
    const offenceEndTime = offence.offenceEndTime ? ` ${offence.offenceEndTime}` : ""
    offenceEndDateTime = `${offence.offenceEndDate}${offenceEndTime}`
  }

  const adjudication = offence.adjudications?.sort((a, b) => (a.appearanceNumber < b.appearanceNumber ? 1 : -1))[0]
  const disposalResults = offence.disposalResults
    ? offence.disposalResults.map((disposalResult, disposalResultIndex) =>
        mapDisposalResult(disposalResult, disposalResultIndex, sensitive)
      )
    : undefined

  return {
    Offence: `#${offenceIndex + 1}`,
    "Court offence sequence number": offence.courtOffenceSequenceNumber,
    Code: await getOffenceCodeDetails(offence.cjsOffenceCode),
    Description: sensitive(offence.offenceDescription),
    "Number of offences taken into consideration (TIC)": offence.offenceTic || undefined,
    "Start date and time": offenceStartDateTime,
    "End date and time": offenceEndDateTime,
    "Role qualifiers": offence.roleQualifiers,
    Plea: offence.plea,
    Adjudication: adjudication ? `${adjudication.adjudication} (${adjudication.disposalDate})` : undefined,
    "Disposal Results": disposalResults
  }
}

const mapQuery = async (
  response: AsnQueryResponse | ErrorResponse,
  errors: string[],
  timestamp: string,
  sensitive: SensitiveFn
) => {
  const metadata: Metadata = {
    title: `${errors.length > 0 ? "❌" : "✅"} Bichard Query: Existing PNC offences and results`,
    timestamp: timestamp,
    errors
  }

  if (errors.length > 0) {
    return {
      metadata: { ...metadata, errors: errors }
    }
  }

  const courtCases = await Promise.all(
    (response as AsnQueryResponse).disposals.map(async (disposal, disposalIndex) => {
      const offences = await Promise.all(
        disposal.offences.map((offence, offenceIndex) => mapOffence(offence, offenceIndex, sensitive))
      )

      return {
        "Court case": `#${disposalIndex + 1}`,
        "Conviction date": disposal.convictionDate,
        "Court case reference": sensitive(disposal.courtCaseReference),
        "Court case ID": disposal.courtCaseId && disposal.courtCaseId !== "-" ? disposal.courtCaseId : undefined,
        "Other TIC": disposal.otherTicTotal,
        "User reference": disposal.userReference,
        Court:
          disposal.court.courtIdentityType === "code"
            ? getCourtDetailsByLjaCode(disposal.court.courtCode)
            : disposal.court.courtName,
        Offences: offences
      }
    })
  )

  return {
    metadata,
    "Court cases": courtCases
  }
}

export default mapQuery
