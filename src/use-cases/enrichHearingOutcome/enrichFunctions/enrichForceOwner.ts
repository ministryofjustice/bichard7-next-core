import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import logger from "src/utils/logging"

const PTIURN_REGEX = new RegExp("00(N|P)P,[0-9]{2}00")
const ASN_REGEX = new RegExp(
  "0800(N|P)P01[0-9]{11}[A-HJ-NP-RT-Z]{1},[0-9]{4}NRPR[0-9A-Z]{12},[0-9]{2}12LN00[0-9]{11}[A-HJ-NP-RT-Z]{1},[0-9]{2}00NP00[0-9]{11}[A-HJ-NP-RT-Z]{1},[0-9]{2}6300[0-9]{13}[A-HJ-NP-RT-Z]{1},[0-9]{2}06SS[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1},[0-9]{2}00XX[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1},[0-9]{2}50(11|12|21|41|42|43|OF|SJ)[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1}"
)

const populateForceOwner = (
  hearingOutcome: AnnotatedHearingOutcome,
  forceStationCode: string
): AnnotatedHearingOutcome => {
  const secondLevelCode = forceStationCode.substring(0, 2)
  const thirdLevelCode = forceStationCode.length >= 4 ? forceStationCode.substring(2, 4) : "00"
  const bottomLevelCode = "00"

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
    SecondLevelCode: secondLevelCode,
    ThirdLevelCode: thirdLevelCode,
    BottomLevelCode: bottomLevelCode,
    OrganisationUnitCode: secondLevelCode + thirdLevelCode + bottomLevelCode
  }
  return hearingOutcome
}

/*
  Try to get the forceStationCode from the PNC Query
  Failing that, the case PTIURN
  Failing that, the case ASN
  Failing that, the courtHearingLocation
*/
const getForceStationCode = (hearingOutcome: AnnotatedHearingOutcome): string | undefined => {
  if (hearingOutcome.PncQuery && hearingOutcome.PncQuery.forceStationCode) {
    return hearingOutcome.PncQuery.forceStationCode
  }

  const ahoCase = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case
  if (ahoCase.PTIURN) {
    const p = ahoCase.PTIURN.substring(0, 4)
    if (p.match(PTIURN_REGEX)) {
      return p
    } else {
      logger.info(`PTIURN doesn't match internal validation regex: ${ahoCase.PTIURN}`)
    }
  }

  const asn = ahoCase.HearingDefendant.ArrestSummonsNumber
  if (asn) {
    const a = asn.substring(asn.length - 18)
    if (a.match(ASN_REGEX)) {
      return a
    } else {
      logger.info(`ASN doesn't match internal validation regex: ${asn}`)
    }
  }

  const courtHearingLocation = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation
  if (courtHearingLocation.SecondLevelCode) {
    return courtHearingLocation.SecondLevelCode
  }
}

const enrichForceOwner = (hearingOutcome: AnnotatedHearingOutcome) => {
  const forceStationCode = getForceStationCode(hearingOutcome)
  if (forceStationCode) {
    hearingOutcome = populateForceOwner(hearingOutcome, forceStationCode)
  } else {
    logger.error("Unable to populate ForceOwner Organisation Unit")
  }
  return hearingOutcome
}

export default enrichForceOwner
