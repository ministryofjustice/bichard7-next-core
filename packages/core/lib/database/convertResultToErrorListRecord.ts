import type { AnnotatedHearingOutcome, OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import type ErrorListRecord from "../../types/ErrorListRecord"
import { QualityCheckStatus } from "../../types/ErrorListRecord"
import Phase from "../../types/Phase"
import type PhaseResult from "../../types/PhaseResult"
import { getAnnotatedHearingOutcome } from "../../types/PhaseResult"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import ResolutionStatus from "../../types/ResolutionStatus"
import serialiseToXml from "../serialise/ahoXml/serialiseToXml"

const generateDefendantName = (aho: AnnotatedHearingOutcome): string => {
  const { DefendantDetail, OrganisationName } = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  const { PersonName } = DefendantDetail ?? {}
  if (PersonName) {
    return `${PersonName.FamilyName} ${PersonName.GivenName}`
  }

  if (OrganisationName) {
    return OrganisationName
  }

  return "Unknown"
}

const generateErrorReport = (aho: AnnotatedHearingOutcome): string => {
  // Bichard generates this in the order they appear in the XML document so we need to do this too
  const ahoXml = serialiseToXml(aho)
  const matches = ahoXml.matchAll(/<([^ |>]*)[^>]* Error="([^"]*)/gm)
  if (!matches) {
    return ""
  }

  // return ""
  return Array.from(matches)
    .map((m) => `${m[2]}||${m[1]}`)
    .join(", ")
}

const generateOrgForPoliceFilter = (forceOwner?: OrganisationUnitCodes): string => {
  if (!forceOwner?.SecondLevelCode) {
    return ""
  }

  if (forceOwner.ThirdLevelCode === null || forceOwner.ThirdLevelCode === "00") {
    return forceOwner.SecondLevelCode
  }

  return `${forceOwner.SecondLevelCode}${forceOwner.ThirdLevelCode}`
}

const convertResultToErrorListRecord = (result: PhaseResult): ErrorListRecord => {
  const hearingOutcome = getAnnotatedHearingOutcome(result)

  const generateFalseHasErrorAttributes = result.triggers.length > 0 && hearingOutcome.Exceptions.length === 0

  const caseElem = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case
  const hearing = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const errorReport = generateErrorReport(hearingOutcome)
  const phase = isPncUpdateDataset(hearingOutcome) ? Phase.PNC_UPDATE : Phase.HEARING_OUTCOME

  return {
    message_id: hearing.SourceReference.UniqueID,
    phase,
    error_status: hearingOutcome.Exceptions.length > 0 ? ResolutionStatus.UNRESOLVED : null,
    trigger_status: result.triggers.length > 0 ? ResolutionStatus.UNRESOLVED : null,
    error_quality_checked: hearingOutcome.Exceptions.length > 0 ? QualityCheckStatus.UNCHECKED : null,
    trigger_quality_checked: result.triggers.length > 0 ? QualityCheckStatus.UNCHECKED : null,
    defendant_name: generateDefendantName(hearingOutcome).slice(0, 500),
    trigger_count: result.triggers.length,
    is_urgent: caseElem.Urgent?.urgent ? 1 : 0,
    asn: caseElem.HearingDefendant.ArrestSummonsNumber.slice(0, 21),
    court_code: hearing.CourtHearingLocation.OrganisationUnitCode?.slice(0, 7),
    annotated_msg: serialiseToXml(hearingOutcome),
    updated_msg: serialiseToXml(hearingOutcome, false, generateFalseHasErrorAttributes),
    error_report: errorReport.slice(0, 1000),
    create_ts: new Date(),
    error_reason: errorReport.length > 0 ? errorReport.split("||")[0].slice(0, 350) : null,
    error_insert_ts: new Date(),
    trigger_insert_ts: new Date(),
    trigger_reason: result.triggers.length > 0 ? result.triggers[0].code.slice(0, 350) : null,
    error_count: hearingOutcome.Exceptions.length,
    user_updated_flag: 0,
    msg_received_ts: new Date(),
    court_reference: caseElem.CourtReference.MagistratesCourtReference.slice(0, 11),
    court_date: hearing.DateOfHearing,
    ptiurn: caseElem.PTIURN.slice(0, 11),
    court_name: hearing.CourtHouseName?.slice(0, 500),
    org_for_police_filter: generateOrgForPoliceFilter(caseElem.ForceOwner),
    court_room: hearing.CourtHearingLocation.BottomLevelCode || undefined,
    pnc_update_enabled: "Y"
  }
}

export default convertResultToErrorListRecord
