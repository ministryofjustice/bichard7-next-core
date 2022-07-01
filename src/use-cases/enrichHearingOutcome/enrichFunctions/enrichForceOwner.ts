import type { AnnotatedHearingOutcome, OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"
import { forceCodeExists, lookupOrganisationUnitByCode } from "src/use-cases/dataLookup"
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

const isDummy = (code: string): boolean => {
  return !!code.match(/^00(N|P)P/) || !!code.match(/^[0-9]{2}00/)
}

const getValidForceOrForceStation = (code: string | undefined): string | undefined => {
  let forceCode: string
  if (code === undefined) {
    return
  }
  if (code.length >= 2) {
    forceCode = code.substring(0, 2)
    if (forceCodeExists(forceCode)) {
      if (code.length >= 4) {
        const stationCode = code.substring(2, 4)
        const lookupResult = lookupOrganisationUnitByCode({
          TopLevelCode: "",
          SecondLevelCode: forceCode,
          ThirdLevelCode: stationCode,
          BottomLevelCode: "00"
        } as OrganisationUnitCodes)
        if (lookupResult) {
          return `${forceCode}${stationCode}`
        }
      }
      return forceCode
    }
  }
}

/*
  Try to get the forceStationCode from the PNC Query
  Failing that, the case PTIURN
  Failing that, the case ASN
  Failing that, the courtHearingLocation
*/

const getForceStationCode = (hearingOutcome: AnnotatedHearingOutcome): string | undefined => {
  const pncCode = getValidForceOrForceStation(hearingOutcome.PncQuery?.forceStationCode)
  if (pncCode) {
    return pncCode
  }

  const ahoCase = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case
  const ptiurnCode = getValidForceOrForceStation(ahoCase.PTIURN)
  if (ptiurnCode && !isDummy(ptiurnCode)) {
    return ptiurnCode
  }

  const asn = ahoCase.HearingDefendant.ArrestSummonsNumber
  const asnCode = getValidForceOrForceStation(asn.substring(asn.length - 18))
  if (asnCode && !isDummy(asnCode)) {
    return asnCode
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
