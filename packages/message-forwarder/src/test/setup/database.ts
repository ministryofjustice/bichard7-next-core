import parseAhoXml from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { CaseRow } from "@moj-bichard7/common/types/Case"
import { randomUUID } from "crypto"
import type { Sql } from "postgres"
import dummyAhoXml from "../fixtures/AnnotatedHO1.json"

const ahoXml = dummyAhoXml.hearingOutcomeXml
export const generateAho = () => parseAhoXml(ahoXml) as AnnotatedHearingOutcome

const getDefaultCase = (): Omit<CaseRow, "court_name_upper" | "defendant_name_upper"> => ({
  annotated_msg: ahoXml,
  asn: "1901ID0100000006148H",
  court_code: "ABC",
  court_date: new Date("2025-05-23"),
  court_name: "Kingston Crown Court",
  court_reference: "ABC",
  court_room: "",
  create_ts: new Date("2025-05-23"),
  defendant_name: "Defendant",
  error_count: 1,
  error_id: 1,
  error_insert_ts: new Date("2025-05-23"),
  error_locked_by_id: null,
  error_quality_checked: null,
  error_reason: "",
  error_report: "HO100304||br7:ArrestSummonsNumber",
  error_resolved_ts: null,
  error_resolved_by: "",
  error_status: 1,
  hearing_outcome: generateAho(),
  is_urgent: 1,
  last_pnc_failure_resubmission_ts: null,
  message_id: randomUUID(),
  msg_received_ts: new Date("2025-05-23"),
  org_for_police_filter: "01",
  phase: 1,
  pnc_update_enabled: "",
  ptiurn: "00112233",
  resolution_ts: null,
  total_pnc_failure_resubmissions: 0,
  trigger_count: 1,
  trigger_insert_ts: new Date("2025-05-23"),
  trigger_locked_by_id: null,
  trigger_quality_checked: null,
  trigger_reason: "",
  trigger_resolved_ts: null,
  trigger_resolved_by: "",
  trigger_status: 1,
  updated_msg: null,
  updated_hearing_outcome: null,
  user_updated_flag: 1
})

export const clearTables = async (db: Sql) => {
  await db`DELETE FROM br7own.error_list_triggers;`
  await db`DELETE FROM br7own.error_list_notes;`
  await db`DELETE FROM br7own.error_list;`
}

export const insertCase = (db: Sql, caseOverrides?: Partial<CaseRow>) => {
  const caseToInsert = { ...getDefaultCase(), ...(caseOverrides ?? {}) }
  const caseColumns = Object.keys(caseToInsert).sort()
  return db<CaseRow[]>`
    INSERT INTO br7own.error_list
      ${db(caseToInsert as never, caseColumns)}
    RETURNING *;
  `
}
