import { convertDate } from "@moj-bichard7/core/lib/policeGateway/leds/dateTimeConverter"
import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "@moj-bichard7/core/phase3/lib/getPncCourtCode"
import type {
  AppearanceResult,
  CurrentAppearance,
  NextAppearance,
  RemandRequest
} from "@moj-bichard7/core/types/leds/RemandRequest"
import type { PncRemandJson } from "../convertPncXmlToJson/convertPncXmlToJson"

const remandStatusByPncCode: Record<string, AppearanceResult> = {
  B: "remanded-on-bail",
  O: "remanded-in-care",
  A: "adjourned",
  C: "remanded-in-custody"
}

const mapToCurrentAppearance = (remandLocationCourt: string, courtNameType1: string): CurrentAppearance => {
  return {
    court:
      remandLocationCourt === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
        ? {
            courtIdentityType: "name",
            courtName: courtNameType1
          }
        : {
            courtIdentityType: "code",
            courtCode: remandLocationCourt
          }
  }
}

const mapToNextAppearance = (
  institutionCode: string,
  nextAppearanceDate: string,
  courtNameType2: string
): NextAppearance => {
  return {
    date: nextAppearanceDate ? convertDate(nextAppearanceDate) : undefined,
    court:
      institutionCode === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
        ? {
            courtIdentityType: "name",
            courtName: courtNameType2
          }
        : {
            courtIdentityType: "code",
            courtCode: institutionCode
          }
  }
}

export const convertPncJsonToLedsRemandRequest = (pncJson: PncRemandJson): RemandRequest => {
  const { remandLocationCourt, courtNameType1, institutionCode, nextAppearanceDate, courtNameType2 } = pncJson

  return {
    ownerCode: pncJson.forceStationCode,
    checkname: pncJson.pncCheckName,
    personUrn: pncJson.pncIdentifier,
    remandDate: convertDate(pncJson.remandDate),
    appearanceResult: remandStatusByPncCode[pncJson.remandResult],
    bailConditions: pncJson.bailConditions.split(" ").filter(Boolean) ?? [],
    currentAppearance: mapToCurrentAppearance(remandLocationCourt, courtNameType1),
    nextAppearance: mapToNextAppearance(institutionCode, nextAppearanceDate, courtNameType2)
  }
}
