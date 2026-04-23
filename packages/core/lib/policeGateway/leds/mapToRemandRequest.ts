import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type RemandPncUpdateRequest from "../../../phase3/types/RemandPncUpdateRequest"
import type {
  AppearanceResult,
  CurrentAppearance,
  NextAppearance,
  RemandRequest
} from "../../../types/leds/RemandRequest"

import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../phase3/lib/getPncCourtCode"
import { convertDate } from "./dateTimeConverter"

const remandStatusByPncCode: Record<string, AppearanceResult> = {
  B: "remanded-on-bail",
  O: "remanded-in-care",
  A: "adjourned",
  C: "remanded-in-custody"
}
const BAIL_CONDITIONS_LENGTH = 50
const BAIL_CONDITIONS_PER_LINE = 4

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
    date: nextHearingDate ? convertDate(nextHearingDate) : undefined,
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

const mapBailConditions = (bailConditions: string): string => {
  const conditions = (bailConditions.match(new RegExp(".{1," + BAIL_CONDITIONS_LENGTH + "}", "g")) ?? []).map(
    (condition) => condition.trim()
  )

  return Array.from({ length: BAIL_CONDITIONS_PER_LINE }, (_, i) => conditions[i] ?? "").join("\n")
}

const mapToRemandRequest = (
  request: RemandPncUpdateRequest["request"],
  pncUpdateDataset: PncUpdateDataset
): RemandRequest => {
  const { forceStationCode, hearingDate, pncRemandStatus, bailConditions } = request
  const pncIdentifier = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier

  return {
    ownerCode: forceStationCode,
    personUrn: pncIdentifier ?? "",
    remandDate: convertDate(hearingDate),
    appearanceResult: remandStatusByPncCode[pncRemandStatus],
    bailConditions: bailConditions.flatMap(mapBailConditions),
    currentAppearance: mapToCurrentAppearance(request),
    nextAppearance: mapToNextAppearance(request)
  }
}

export default mapToRemandRequest
