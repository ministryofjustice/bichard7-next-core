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

const getForceStationCode = (hearingOutcome: AnnotatedHearingOutcome): string | undefined => {
  if (hearingOutcome.PncQuery && hearingOutcome.PncQuery.forceStationCode) {
    return hearingOutcome.PncQuery.forceStationCode
  }
  if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN) {
    return hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN.substring(0, 4)
  }
  const asn = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  if (asn) {
    return asn.substring(asn.length - 18)
  }
  if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.SecondLevelCode) {
    return hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.SecondLevelCode
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
