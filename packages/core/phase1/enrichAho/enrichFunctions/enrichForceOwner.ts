import type { AnnotatedHearingOutcome, OrganisationUnitCodes } from "types/AnnotatedHearingOutcome"
import { lookupOrganisationUnitByCode } from "phase1/dataLookup"
import isAsnValid from "phase1/lib/isAsnValid"
import logger from "phase1/lib/logging"
import type { EnrichAhoFunction } from "phase1/types/EnrichAhoFunction"

// prettier-ignore
const validForceCodes = [
  "01","02","03","04","05","06","07","10","11","12","13","14","16","17","20","21","22",
  "23","24","30","31","32","33","34","35","36","37","40","41","42","43","44","45","46",
  "47","48","50","52","53","54","55","60","61","62","63","67","88","89","91","93"
]

const isValidForceCode = (code: string): boolean => validForceCodes.includes(code)

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

const dummyPtiurnRegexes = [/^00(N|P)P/, /^[0-9]{2}00/]

const isDummyPtiurn = (code: string): boolean => dummyPtiurnRegexes.some((regex) => !!code.match(regex))

const dummyAsnRegexes = [
  /0800(N|P)P01[0-9]{11}[A-HJ-NP-RT-Z]{1}/,
  /[0-9]{4}NRPR[0-9A-Z]{12}/,
  /[0-9]{2}12LN00[0-9]{11}[A-HJ-NP-RT-Z]{1}/,
  /[0-9]{2}00NP00[0-9]{11}[A-HJ-NP-RT-Z]{1}/,
  /[0-9]{2}6300[0-9]{13}[A-HJ-NP-RT-Z]{1}/,
  /[0-9]{2}06SS[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1}/,
  /[0-9]{2}00XX[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1}/,
  /[0-9]{2}50(11|12|21|41|42|43|OF|SJ)[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1}/
]

const isDummyAsn = (code: string): boolean => dummyAsnRegexes.some((regex) => !!code.match(regex))

const getValidForceOrForceStation = (code: string | undefined): string | undefined => {
  let forceCode: string
  if (code === undefined) {
    return
  }
  if (code.length >= 2) {
    forceCode = code.substring(0, 2)
    if (isValidForceCode(forceCode)) {
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

  //TODO: Need to check for an HO100201 exception here and not use PTIURN if there is one
  const ahoCase = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case
  const ptiurnCode = getValidForceOrForceStation(ahoCase.PTIURN)
  if (ptiurnCode && !isDummyPtiurn(ptiurnCode)) {
    return ptiurnCode
  }

  const asn = ahoCase.HearingDefendant.ArrestSummonsNumber
  const asnValid = isAsnValid(asn)
  if (asnValid) {
    const asnCode = getValidForceOrForceStation(asn.substring(asn.length - 18))
    if (asnCode && !isDummyAsn(asn)) {
      return asnCode
    }
  }

  const courtHearingLocation = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation
  if (courtHearingLocation.SecondLevelCode) {
    return courtHearingLocation.SecondLevelCode
  }
}

const enrichForceOwner: EnrichAhoFunction = (hearingOutcome) => {
  if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner) {
    return hearingOutcome
  }

  const forceStationCode = getForceStationCode(hearingOutcome)
  if (forceStationCode) {
    hearingOutcome = populateForceOwner(hearingOutcome, forceStationCode)
  } else {
    logger.error("Unable to populate ForceOwner Organisation Unit")
  }
  return hearingOutcome
}

export default enrichForceOwner
