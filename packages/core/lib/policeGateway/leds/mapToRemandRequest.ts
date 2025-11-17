import type RemandPncUpdateRequest from "../../../phase3/types/RemandPncUpdateRequest"
import type {
  AppearanceResult,
  CurrentAppearance,
  NextAppearance,
  RemandRequest
} from "../../../types/leds/RemandRequest"

import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../phase3/lib/getPncCourtCode"
import convertPncDateTimeToLedsDateTime from "./mapToAddDisposalRequest/convertPncDateTimeToLedsDateTime"

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
    date: convertPncDateTimeToLedsDateTime(nextHearingDate).date,
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

  return {
    ownerCode: forceStationCode,
    checkname: pncCheckName ?? "",
    personUrn: pncIdentifier ?? "",
    remandDate: convertPncDateTimeToLedsDateTime(hearingDate).date,
    appearanceResult: remandStatusByPncCode[pncRemandStatus],
    bailConditions: bailConditions,
    currentAppearance: mapToCurrentAppearance(request),
    nextAppearance: mapToNextAppearance(request)
  }
}

export default mapToRemandRequest
