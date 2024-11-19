import type { AnnotatedHearingOutcome, OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import type ErrorListRecord from "../../types/ErrorListRecord"
import type PhaseResult from "../../types/PhaseResult"

import { QualityCheckStatus } from "../../types/ErrorListRecord"
import Phase from "../../types/Phase"
import { getAnnotatedHearingOutcome } from "../../types/PhaseResult"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import ResolutionStatus from "../../types/ResolutionStatus"
import serialiseToAhoXml from "../serialise/ahoXml/serialiseToXml"
import serialiseToAnnotatedPncUpdateDatasetXml from "../serialise/annotatedPncUpdateDatasetXml/serialiseToXml"
import serialiseToPncUpdateDatasetXml from "../serialise/pncUpdateDatasetXml/serialiseToXml"

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
  const ahoXml = serialiseToAhoXml(aho)
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
  const annotatedMessageXml = isPncUpdateDataset(hearingOutcome)
    ? serialiseToAnnotatedPncUpdateDatasetXml(hearingOutcome)
    : serialiseToAhoXml(hearingOutcome)
  const updatedMessageXml = isPncUpdateDataset(hearingOutcome)
    ? serialiseToPncUpdateDatasetXml(hearingOutcome, generateFalseHasErrorAttributes)
    : serialiseToAhoXml(hearingOutcome, false, generateFalseHasErrorAttributes)

  return {
    annotated_msg: annotatedMessageXml,
    asn: caseElem.HearingDefendant.ArrestSummonsNumber.slice(0, 21),
    court_code: hearing.CourtHearingLocation.OrganisationUnitCode?.slice(0, 7),
    court_date: hearing.DateOfHearing,
    court_name: hearing.CourtHouseName?.slice(0, 500),
    court_reference: caseElem.CourtReference.MagistratesCourtReference.slice(0, 11),
    court_room: hearing.CourtHearingLocation.BottomLevelCode || undefined,
    create_ts: new Date(),
    defendant_name: generateDefendantName(hearingOutcome).slice(0, 500),
    error_count: hearingOutcome.Exceptions.length,
    error_insert_ts: new Date(),
    error_quality_checked: hearingOutcome.Exceptions.length > 0 ? QualityCheckStatus.UNCHECKED : null,
    error_reason: errorReport.length > 0 ? errorReport.split("||")[0].slice(0, 350) : null,
    error_report: errorReport.slice(0, 1000),
    error_status: hearingOutcome.Exceptions.length > 0 ? ResolutionStatus.UNRESOLVED : null,
    is_urgent: caseElem.Urgent?.urgent ? 1 : 0,
    message_id: hearing.SourceReference.UniqueID,
    msg_received_ts: new Date(),
    org_for_police_filter: generateOrgForPoliceFilter(caseElem.ForceOwner),
    phase,
    pnc_update_enabled: "Y",
    ptiurn: caseElem.PTIURN.slice(0, 11),
    trigger_count: result.triggers.length,
    trigger_insert_ts: new Date(),
    trigger_quality_checked: result.triggers.length > 0 ? QualityCheckStatus.UNCHECKED : null,
    trigger_reason: result.triggers.length > 0 ? result.triggers[0].code.slice(0, 350) : null,
    trigger_status: result.triggers.length > 0 ? ResolutionStatus.UNRESOLVED : null,
    updated_msg: updatedMessageXml,
    user_updated_flag: 0
  }
}

export default convertResultToErrorListRecord
