import type { Sql } from "postgres"
import type { PromiseResult } from "src/comparison/types"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type { AnnotatedHearingOutcome, OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"
import type ErrorListRecord from "src/types/ErrorListRecord"
import { QualityCheckStatus } from "src/types/ErrorListRecord"
import type ErrorListTriggerRecord from "src/types/ErrorListTriggerRecord"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import ResolutionStatus from "src/types/ResolutionStatus"

const generateDefendantName = (aho: AnnotatedHearingOutcome): string => {
  const personName = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName
  return `${personName?.FamilyName} ${personName?.GivenName}`
}

const generateErrorReport = (aho: AnnotatedHearingOutcome): string => {
  // Bichard generates this in the order they appear in the XML document so we need to do this too
  const ahoXml = convertAhoToXml(aho)
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

const convertResultToErrorListRecord = (result: Phase1SuccessResult): ErrorListRecord => {
  const generateFalseHasErrorAttributes = result.triggers.length > 0 && result.hearingOutcome.Exceptions.length === 0

  const caseElem = result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case
  const hearing = result.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const errorReport = generateErrorReport(result.hearingOutcome)
  return {
    message_id: hearing.SourceReference.UniqueID,
    phase: 1,
    error_status: result.hearingOutcome.Exceptions.length > 0 ? ResolutionStatus.UNRESOLVED : null,
    trigger_status: result.triggers.length > 0 ? ResolutionStatus.UNRESOLVED : null,
    error_quality_checked: result.hearingOutcome.Exceptions.length > 0 ? QualityCheckStatus.UNCHECKED : null,
    trigger_quality_checked: result.triggers.length > 0 ? QualityCheckStatus.UNCHECKED : null,
    defendant_name: generateDefendantName(result.hearingOutcome),
    trigger_count: result.triggers.length,
    is_urgent: caseElem.Urgent?.urgent ? 1 : 0,
    asn: caseElem.HearingDefendant.ArrestSummonsNumber,
    court_code: hearing.CourtHearingLocation.OrganisationUnitCode,
    annotated_msg: convertAhoToXml(result.hearingOutcome),
    updated_msg: convertAhoToXml(result.hearingOutcome, false, generateFalseHasErrorAttributes),
    error_report: errorReport,
    create_ts: new Date(),
    error_reason: errorReport.length > 0 ? errorReport.split("||")[0] : null,
    error_insert_ts: new Date(),
    trigger_insert_ts: new Date(),
    trigger_reason: result.triggers.length > 0 ? result.triggers[0].code : null,
    error_count: result.hearingOutcome.Exceptions.length,
    user_updated_flag: 0,
    msg_received_ts: new Date(),
    court_reference: caseElem.CourtReference.MagistratesCourtReference.slice(0, 11),
    court_date: hearing.DateOfHearing,
    ptiurn: caseElem.PTIURN,
    court_name: hearing.CourtHouseName,
    org_for_police_filter: generateOrgForPoliceFilter(caseElem.ForceOwner),
    court_room: hearing.CourtHearingLocation.BottomLevelCode || undefined,
    pnc_update_enabled: "Y"
  }
}

const insertErrorListRecord = async (sql: Sql, result: Phase1SuccessResult): PromiseResult<void> => {
  const errorListRecord = convertResultToErrorListRecord(result)
  try {
    const newRecordResult = await sql<ErrorListRecord[]>`
      INSERT INTO br7own.error_list ${sql(errorListRecord)} RETURNING *`

    if (!newRecordResult[0].error_id) {
      throw new Error("Error inserting to error_list table")
    }

    for (const trigger of result.triggers) {
      const triggerRecord: ErrorListTriggerRecord = {
        error_id: newRecordResult[0].error_id,
        trigger_code: trigger.code,
        status: ResolutionStatus.UNRESOLVED,
        create_ts: new Date()
      }
      if (trigger.offenceSequenceNumber) {
        triggerRecord.trigger_item_identity = String(trigger.offenceSequenceNumber)
      }
      await sql`
        INSERT INTO br7own.error_list_triggers ${sql(triggerRecord)}`
    }
  } catch (e) {
    const error = e as any
    if (error.severity !== "NOTICE") {
      console.error(e)
      return e as Error
    }
  }
}

export default insertErrorListRecord
