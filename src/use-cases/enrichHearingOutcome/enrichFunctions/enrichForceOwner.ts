import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import logger from "src/utils/logging"

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
    return ahoCase.PTIURN.substring(0, 4)
  }

  const asn = ahoCase.HearingDefendant.ArrestSummonsNumber
  if (asn) {
    return asn.substring(asn.length - 18)
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
