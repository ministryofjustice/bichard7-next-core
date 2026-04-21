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
import preProcessPersonUrn from "./preProcessPersonUrn"

const remandStatusByPncCode: Record<string, AppearanceResult> = {
  B: "remanded-on-bail",
  O: "remanded-in-care",
  A: "adjourned",
  C: "remanded-in-custody"
}
const bailConditionLength = 50

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

const mapBailConditions = (bailConditions: string): string[] => {
  return (bailConditions.match(new RegExp(".{1," + bailConditionLength + "}", "g")) ?? [])
    .map((condition) => condition.padEnd(bailConditionLength, " "))
    .filter((condition) => !!condition.trim())
}

const mapToRemandRequest = (
  request: RemandPncUpdateRequest["request"],
  pncUpdateDataset: PncUpdateDataset
): RemandRequest => {
  const { forceStationCode, hearingDate, pncRemandStatus, bailConditions } = request
  const pncIdentifier = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier
  const personUrn = preProcessPersonUrn(pncIdentifier) ?? ""

  return {
    // TEMP: Remove before PR approval
    pncCheckName: request.pncCheckName ?? "",
    croNumber: request.croNumber ?? "",
    arrestSummonsNumber: request.arrestSummonsNumber,
    crimeOffenceReferenceNo: "",
    remandResult: "",
    remandLocationFfss: "",
    // TEMP: Remove before PR approval
    ownerCode: forceStationCode,
    personUrn,
    remandDate: convertDate(hearingDate),
    appearanceResult: remandStatusByPncCode[pncRemandStatus],
    bailConditions: bailConditions.flatMap(mapBailConditions),
    currentAppearance: mapToCurrentAppearance(request),
    nextAppearance: mapToNextAppearance(request)
  }
}

export default mapToRemandRequest
