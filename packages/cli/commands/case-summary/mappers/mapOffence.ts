import type { AdditionalArrestOffences, Offence } from "@moj-bichard7/core/types/leds/DisposalRequest"
import type SensitiveFn from "../types/SensitiveFn"
import getOffenceCodeDetails from "../utils/getOffenceCodeDetails"
import getResultCodeDetails from "../utils/getResultCodeDetails"

type AdditionalOffence = AdditionalArrestOffences["additionalOffences"][0]

const mapOffence = async (offence: AdditionalOffence | Offence, offenceIndex: number, sensitive: SensitiveFn) => {
  const additionalOffence = offence as AdditionalOffence
  let offenceCode = (offence as Offence).cjsOffenceCode
  if (additionalOffence.offenceCode && additionalOffence.offenceCode.offenceCodeType === "cjs") {
    offenceCode = await getOffenceCodeDetails(additionalOffence.offenceCode.cjsOffenceCode)
  }

  const offenceStartDateTime = offence.offenceStartDate
    ? `${offence.offenceStartDate}${offence.offenceStartTime ? ` ${offence.offenceStartTime}` : ""}`
    : undefined
  const offenceEndDateTime = offence.offenceEndDate
    ? `${offence.offenceEndDate}${offence.offenceEndTime ? ` ${offence.offenceEndTime}` : ""}`
    : undefined

  const disposalResults = await Promise.all(
    offence.disposalResults.map(async (disposalResult, disposalIndex) => ({
      Disposal: `#${disposalIndex + 1}`,
      "Disposal code": await getResultCodeDetails(disposalResult.disposalCode),
      "Disposal text": sensitive(disposalResult.disposalText),
      "Effective date": disposalResult.disposalEffectiveDate,
      Fine: disposalResult.disposalFine ? `${disposalResult.disposalFine.amount} ${disposalResult.disposalFine.units}` : undefined,
      Duration: disposalResult.disposalDuration ? `${disposalResult.disposalDuration.count} ${disposalResult.disposalDuration.units}` : undefined,
      Qualifiers: disposalResult.disposalQualifiers,
      "Qualifier duration": disposalResult.disposalQualifierDuration
        ? `${disposalResult.disposalQualifierDuration.count} ${disposalResult.disposalQualifierDuration.units}`
        : undefined
    }))
  )

  return {
    Offence: `#${offenceIndex + 1}`,
    "Court offence sequence number": offence.courtOffenceSequenceNumber,
    Code: offenceCode,
    Description: sensitive(additionalOffence.offenceDescription),
    "Number of offences taken into consideration (TIC)": offence.offenceTic,
    "Start date and time": offenceStartDateTime,
    "End date and time": offenceEndDateTime,
    "Role qualifiers": offence.roleQualifiers,
    Plea: offence.plea,
    Adjudication: offence.adjudication,
    "Disposal Results": disposalResults
  }
}

export default mapOffence
