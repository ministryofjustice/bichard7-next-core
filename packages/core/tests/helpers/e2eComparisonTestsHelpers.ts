import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import orderBy from "lodash.orderby"
import postgres from "postgres"

import type { DbRecords } from "../../comparison/types/ComparisonFile"
import type ErrorListRecord from "../../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"
import type { Trigger } from "../../types/Trigger"

const dbConfig = createDbConfig()
const sql = postgres(dbConfig)

const sortTriggers = (triggers: Trigger[]) => orderBy(triggers, ["code", "identifier"])

const normaliseTriggers = (triggers: ErrorListTriggerRecord[]): ErrorListTriggerRecord[] =>
  orderBy(triggers, ["trigger_code", "trigger_item_identity"])

const insertRecords = async (records: DbRecords): Promise<void> => {
  const errorList = records.errorList.map((record) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { defendant_name_upper, court_name_upper, ...newRecord } = record
    return newRecord
  })
  if (errorList.length === 0) {
    return
  }

  await sql<ErrorListRecord[]>`INSERT INTO br7own.error_list ${sql(errorList)} returning error_id`

  if (records.errorListNotes.length > 0) {
    await sql<ErrorListRecord[]>`INSERT INTO br7own.error_list_notes ${sql(records.errorListNotes)} returning error_id`
  }

  if (records.errorListTriggers.length > 0) {
    await sql<
      ErrorListRecord[]
    >`INSERT INTO br7own.error_list_triggers ${sql(records.errorListTriggers)} returning error_id`
  }
}

const clearDatabase = async () => {
  await sql`DELETE FROM br7own.error_list_triggers`
  await sql`DELETE FROM br7own.error_list_notes`
  await sql`DELETE FROM br7own.error_list`
}

export { clearDatabase, insertRecords, normaliseTriggers, sortTriggers, sql }
