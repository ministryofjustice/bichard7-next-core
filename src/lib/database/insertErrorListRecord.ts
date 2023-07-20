import type { PostgresError, Sql } from "postgres"
import type ErrorListRecord from "src/types/ErrorListRecord"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import convertResultToErrorListRecord from "./convertResultToErrorListRecord"
import insertErrorListTriggers from "./insertErrorListTriggers"

const insertErrorListRecord = async (db: Sql, result: Phase1SuccessResult): Promise<number> => {
  const errorListRecord = convertResultToErrorListRecord(result)
  let newRecordId: number | undefined
  try {
    const newRecordResult = await db<ErrorListRecord[]>`
      INSERT INTO br7own.error_list ${db(errorListRecord)} RETURNING *`

    if (!newRecordResult[0].error_id) {
      throw new Error("Error inserting to error_list table")
    }
    newRecordId = newRecordResult[0].error_id
    await insertErrorListTriggers(db, newRecordId, result.triggers)
  } catch (e) {
    const error = e as PostgresError
    if (error.severity !== "NOTICE") {
      console.error(e)
      throw error
    }
  }
  if (newRecordId === undefined) {
    throw new Error("Error inserting new error_list record")
  }
  return newRecordId
}

export default insertErrorListRecord
