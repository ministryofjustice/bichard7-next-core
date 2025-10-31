import type RemandPncUpdateRequest from "../../../phase3/types/RemandPncUpdateRequest"
import type {
  AppearanceResult,
  CurrentAppearance,
  NextAppearance,
  RemandRequest
} from "../../../types/leds/RemandRequest"

import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../phase3/lib/getPncCourtCode"

const remandStatusByPncCode: Record<string, AppearanceResult> = {
  B: "remanded-on-bail",
  O: "remanded-in-care",
  A: "adjourned",
  C: "remanded-in-custody"
}

const mapToCurrentAppearance = (data: RemandPncUpdateRequest["request"]): CurrentAppearance => {
  const { remandLocationCourt, courtNameType1 } = data

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

const mapToNextAppearance = (data: RemandPncUpdateRequest["request"]): NextAppearance => {
  const { nextHearingDate, psaCourtCode, courtNameType2 } = data

  return {
    date: nextHearingDate,
    court:
      psaCourtCode === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
        ? {
            courtIdentityType: "name",
            courtName: courtNameType2
          }
        : {
            courtIdentityType: "code",
            courtCode: psaCourtCode
          }
  }
}

const mapToRemandRequest = (request: RemandPncUpdateRequest["request"]): RemandRequest => {
  const { forceStationCode, pncCheckName, pncIdentifier, hearingDate, pncRemandStatus, bailConditions } = request
  const appearanceResult = remandStatusByPncCode[pncRemandStatus]

  return {
    ownerCode: forceStationCode,
    checkname: pncCheckName ?? "",
    personUrn: pncIdentifier ?? "",
    remandDate: hearingDate,
    appearanceResult: appearanceResult,
    bailConditions: bailConditions,
    currentAppearance: mapToCurrentAppearance(request),
    nextAppearance: mapToNextAppearance(request)
  }
}

export default mapToRemandRequest
