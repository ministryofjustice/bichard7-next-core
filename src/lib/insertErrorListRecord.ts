import type { Client } from "pg"
import type { PromiseResult } from "src/comparison/types"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { Phase1SuccessResult } from "src/types/Phase1Result"

const generateDefendantName = (aho: AnnotatedHearingOutcome): string => {
  const personName = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName
  return `${personName?.FamilyName} ${personName?.GivenName}`
}

const insertErrorListRecord = async (db: Client, record: Phase1SuccessResult): PromiseResult<void> => {
  try {
    const caseElem = record.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case
    const hearing = record.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing
    const newRecordResult = await db.query(
      "INSERT INTO br7own.error_list (\
        message_id, defendant_name, phase, trigger_count, is_urgent, annotated_msg, error_report,\
        create_ts, error_count, user_updated_flag, msg_received_ts, court_reference, court_date, ptiurn,\
        court_name, org_for_police_filter, court_room)\
        VALUES ($1, $2, 1, $3, $4, $5, $6, NOW(), $7, 0, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
      [
        hearing.SourceReference.UniqueID,
        generateDefendantName(record.hearingOutcome),
        record.triggers.length,
        0,
        convertAhoToXml(record.hearingOutcome),
        "",
        record.hearingOutcome.Exceptions.length,
        new Date(),
        caseElem.CourtReference.MagistratesCourtReference,
        hearing.DateOfHearing,
        caseElem.PTIURN,
        hearing.CourtHouseName,
        `${caseElem.ForceOwner?.SecondLevelCode}${caseElem.ForceOwner?.ThirdLevelCode}  `,
        hearing.CourtHearingLocation.BottomLevelCode
      ]
    )

    for (const trigger of record.triggers) {
      await db.query(
        "INSERT INTO br7own.error_list_triggers (error_id, trigger_code, trigger_item_identity, status, create_ts) VALUES ($1, $2, $3, 0, NOW())",
        [newRecordResult.rows[0].error_id, trigger.code, trigger.offenceSequenceNumber]
      )
    }
  } catch (e) {
    console.error(e)
    return e as Error
  }
}

export default insertErrorListRecord
