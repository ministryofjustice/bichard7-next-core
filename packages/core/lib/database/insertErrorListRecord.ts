import type { PostgresError, Sql } from "postgres"
import type ErrorListRecord from "../../phase1/types/ErrorListRecord"
import type Phase1Result from "../../phase1/types/Phase1Result"
import convertResultToErrorListRecord from "./convertResultToErrorListRecord"

const insertErrorListRecord = async (db: Sql, result: Phase1Result): Promise<number> => {
  const errorListRecord = convertResultToErrorListRecord(result)
  let newRecordId: number | undefined
  try {
    const newRecordResult = await db<ErrorListRecord[]>`
      INSERT INTO br7own.error_list ${db(errorListRecord)} RETURNING *`

    if (!newRecordResult[0].error_id) {
      throw new Error("Error inserting to error_list table")
    }
    newRecordId = newRecordResult[0].error_id
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
