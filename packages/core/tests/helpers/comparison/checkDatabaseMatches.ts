import type ErrorListRecord from "../../../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../../../types/ErrorListTriggerRecord"
import type { DbRecords } from "../../types/ComparisonFile"

import { sql } from "./ComparisonTestDbHelpers"
import normaliseErrorListTriggers from "./normaliseErrorListTriggers"
import normaliseXml from "./normaliseXml"

const checkDatabaseMatches = async (expected: DbRecords): Promise<void> => {
  const errorList = await sql<ErrorListRecord[]>`select * from BR7OWN.ERROR_LIST`
  const errorListTriggers = await sql<ErrorListTriggerRecord[]>`select * from BR7OWN.ERROR_LIST_TRIGGERS`
  const expectedTriggers = errorListTriggers.map((trigger) => trigger.trigger_code)

  if (expected.errorList.length === 0 && expected.errorListTriggers.length == 0) {
    expect(errorList).toHaveLength(0)
    expect(errorListTriggers).toHaveLength(0)
    return
  }

  expect(errorList).toHaveLength(expected.errorList.length)

  for (const expectedError of expected.errorList) {
    const actualErrorRecord = errorList.find((record) => record.message_id === expectedError.message_id)!

    expect(actualErrorRecord).toBeDefined()
    expect(actualErrorRecord.message_id).toEqual(expectedError.message_id)
    expect(actualErrorRecord.phase).toEqual(expectedError.phase)
    expect(actualErrorRecord.error_status).toEqual(expectedError.error_status)
    expect(actualErrorRecord.trigger_status).toEqual(expectedError.trigger_status)
    expect(actualErrorRecord.error_quality_checked).toEqual(expectedError.error_quality_checked)
    expect(actualErrorRecord.trigger_quality_checked).toEqual(expectedError.trigger_quality_checked)
    expect(actualErrorRecord.trigger_count).toEqual(expectedError.trigger_count)
    expect(actualErrorRecord.is_urgent).toEqual(expectedError.is_urgent)
    expect(actualErrorRecord.asn).toEqual(expectedError.asn)
    expect(actualErrorRecord.court_code).toEqual(expectedError.court_code)
    expect(normaliseXml(actualErrorRecord.annotated_msg)).toEqualXML(normaliseXml(expectedError.annotated_msg))
    expect(normaliseXml(actualErrorRecord.updated_msg)).toEqualXML(normaliseXml(expectedError.updated_msg))
    expect(actualErrorRecord.error_report).toEqual(expectedError.error_report)
    expect(actualErrorRecord.create_ts).toBeDefined()
    expect(actualErrorRecord.error_reason).toEqual(expectedError.error_reason)

    if (expectedError.trigger_reason) {
      expect(expectedTriggers).toContain(actualErrorRecord.trigger_reason)
    } else {
      expect(actualErrorRecord.trigger_reason).toBeNull()
    }

    expect(actualErrorRecord.error_count).toEqual(expectedError.error_count)
    expect(actualErrorRecord.court_date).toEqual(expectedError.court_date)
    expect(actualErrorRecord.ptiurn).toEqual(expectedError.ptiurn)
    expect(actualErrorRecord.court_name).toEqual(expectedError.court_name)
    expect(actualErrorRecord.msg_received_ts).toBeDefined()
    expect(actualErrorRecord.trigger_resolved_ts).toEqual(expectedError.trigger_resolved_ts)
    expect(actualErrorRecord.defendant_name).toEqual(expectedError.defendant_name)
    expect(actualErrorRecord.org_for_police_filter).toEqual(expectedError.org_for_police_filter)
    expect(actualErrorRecord.court_room).toEqual(expectedError.court_room)
    expect(actualErrorRecord.court_reference).toEqual(expectedError.court_reference)
    expect(actualErrorRecord.error_insert_ts).toBeDefined()
    expect(actualErrorRecord.trigger_insert_ts).toBeDefined()
    expect(actualErrorRecord.pnc_update_enabled).toEqual(expectedError.pnc_update_enabled)
  }

  expect(errorListTriggers).toHaveLength(expected.errorListTriggers.length)
  expect(normaliseErrorListTriggers(errorListTriggers)).toStrictEqual(
    normaliseErrorListTriggers(expected.errorListTriggers)
  )
}

export default checkDatabaseMatches
