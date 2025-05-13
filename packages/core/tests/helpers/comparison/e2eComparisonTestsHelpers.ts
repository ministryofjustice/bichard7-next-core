import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import postgres from "postgres"

import type ErrorListRecord from "../../../types/ErrorListRecord"
import type { DbRecords } from "../../types/ComparisonFile"

const dbConfig = createDbConfig()
const sql = postgres(dbConfig)

const normaliseXml = (xml?: string): string =>
  xml
    ?.replace(/ Error="HO200200"/g, "")
    .replace(/ hasError="false"/g, "")
    .replace(' standalone="yes"', "") ?? ""

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

  if (records.errorListNotes && records.errorListNotes.length > 0) {
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

const disconnectDb = async () => {
  await sql.end({ timeout: 5 })
}

export { clearDatabase, disconnectDb, insertRecords, normaliseXml, sql }
