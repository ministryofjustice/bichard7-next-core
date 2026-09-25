import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { ErrorResponse } from "@moj-bichard7/core/types/leds/ErrorResponse"
import type Metadata from "../types/Metadata"
import type SensitiveFn from "../types/SensitiveFn"
import { getCourtDetailsByLjaCode } from "../utils/courtDetails"
import getOffenceCodeDetails from "../utils/getOffenceCodeDetails"
import getResultCodeDetails from "../utils/getResultCodeDetails"

const mapQuery = async (response: AsnQueryResponse | ErrorResponse, errors: string[], timestamp: string, sensitive: SensitiveFn) => {
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

  const courtCases = []

  const queryResponse = response as AsnQueryResponse
  let courtCaseIndex = 1
  for (const disposal of queryResponse.disposals) {
    const offences = []
    let offenceIndex = 1
    for (const offence of disposal.offences) {
      const offenceStartTime = offence.offenceStartTime ? ` ${offence.offenceStartTime}` : ""
      const offenceStartDateTime = `${offence.offenceStartDate}${offenceStartTime}`
      let offenceEndDateTime = undefined
      if (offence.offenceEndDate) {
        const offenceEndTime = offence.offenceEndTime ? ` ${offence.offenceEndTime}` : ""
        offenceEndDateTime = `${offence.offenceEndDate}${offenceEndTime}`
      }

      const adjudication = offence.adjudications?.sort((a, b) => (a.appearanceNumber < b.appearanceNumber ? 1 : -1))[0]
      const disposalResults = offence.disposalResults
        ? await Promise.all(
            offence.disposalResults.map(async (disposalResult, disposalIndex) => ({
              "Disposal Result": `#${disposalIndex + 1}`,
              "Disposal code": await getResultCodeDetails(disposalResult.disposalCode),
              "Disposal text": sensitive(disposalResult.disposalText),
              "Effective date": disposalResult.disposalEffectiveDate,
              Fine: disposalResult.disposalFine ? `${disposalResult.disposalFine.amount} ${disposalResult.disposalFine.units}` : undefined,
              Duration: disposalResult.disposalDuration
                ? `${disposalResult.disposalDuration.count} ${disposalResult.disposalDuration.units}`
                : undefined,
              Qualifiers: disposalResult.disposalQualifiers,
              "Qualifier duration": disposalResult.disposalQualifierDuration
                ? `${disposalResult.disposalQualifierDuration.count} ${disposalResult.disposalQualifierDuration.units}`
                : undefined
            }))
          )
        : undefined

      offences.push({
        Offence: `#${offenceIndex++}`,
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
      })

      courtCases.push({
        "Court case": `#${courtCaseIndex++}`,
        "Conviction date": disposal.convictionDate,
        "Court case reference": disposal.courtCaseReference,
        "Court case ID": disposal.courtCaseId && disposal.courtCaseId !== "-" ? disposal.courtCaseId : undefined,
        "Other TIC": disposal.otherTicTotal,
        "User reference": disposal.userReference,
        Court: disposal.court.courtIdentityType === "code" ? await getCourtDetailsByLjaCode(disposal.court.courtCode) : disposal.court.courtName,
        Offences: offences
      })
    }
  }

  return {
    metadata,
    "Court cases": courtCases
  }
}

export default mapQuery
