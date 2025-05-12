import type { DbRecords } from "../../../comparison/types/ComparisonFile"
import type ErrorListRecord from "../../../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../../../types/ErrorListTriggerRecord"

import normaliseErrorListTriggers from "../normaliseErrorListTriggers"
import { normaliseXml, sql } from "./e2eComparisonTestsHelpers"

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
  const expectedError = expected.errorList[0]

  expect(errorList[0].message_id).toEqual(expectedError.message_id)
  expect(errorList[0].phase).toEqual(expectedError.phase)
  expect(errorList[0].error_status).toEqual(expectedError.error_status)
  expect(errorList[0].trigger_status).toEqual(expectedError.trigger_status)
  expect(errorList[0].error_quality_checked).toEqual(expectedError.error_quality_checked)
  expect(errorList[0].trigger_quality_checked).toEqual(expectedError.trigger_quality_checked)
  expect(errorList[0].trigger_count).toEqual(expectedError.trigger_count)
  expect(errorList[0].is_urgent).toEqual(expectedError.is_urgent)
  expect(errorList[0].asn).toEqual(expectedError.asn)
  expect(errorList[0].court_code).toEqual(expectedError.court_code)
  expect(normaliseXml(errorList[0].annotated_msg)).toEqualXML(normaliseXml(expectedError.annotated_msg))
  expect(normaliseXml(errorList[0].updated_msg)).toEqualXML(normaliseXml(expectedError.updated_msg))
  expect(errorList[0].error_report).toEqual(expectedError.error_report)
  expect(errorList[0].create_ts).toBeDefined()
  expect(errorList[0].error_reason).toEqual(expectedError.error_reason)

  if (expectedError.trigger_reason) {
    expect(expectedTriggers).toContain(errorList[0].trigger_reason)
  } else {
    expect(errorList[0].trigger_reason).toBeNull()
  }

  expect(errorList[0].error_count).toEqual(expectedError.error_count)
  expect(errorList[0].court_date).toEqual(expectedError.court_date)
  expect(errorList[0].ptiurn).toEqual(expectedError.ptiurn)
  expect(errorList[0].court_name).toEqual(expectedError.court_name)
  expect(errorList[0].msg_received_ts).toBeDefined()
  expect(errorList[0].trigger_resolved_ts).toEqual(expectedError.trigger_resolved_ts)
  expect(errorList[0].defendant_name).toEqual(expectedError.defendant_name)
  expect(errorList[0].org_for_police_filter).toEqual(expectedError.org_for_police_filter)
  expect(errorList[0].court_room).toEqual(expectedError.court_room)
  expect(errorList[0].court_reference).toEqual(expectedError.court_reference)
  expect(errorList[0].error_insert_ts).toBeDefined()
  expect(errorList[0].trigger_insert_ts).toBeDefined()
  expect(errorList[0].pnc_update_enabled).toEqual(expectedError.pnc_update_enabled)

  expect(errorListTriggers).toHaveLength(expected.errorListTriggers.length)
  expect(normaliseErrorListTriggers(errorListTriggers)).toStrictEqual(
    normaliseErrorListTriggers(expected.errorListTriggers)
  )
}

export default checkDatabaseMatches
