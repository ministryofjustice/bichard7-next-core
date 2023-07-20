import type { PostgresError, Sql } from "postgres"
import type ErrorListRecord from "src/types/ErrorListRecord"
import type { Phase1SuccessResult } from "src/types/Phase1Result"

const fetchErrorListRecordId = async (db: Sql, result: Phase1SuccessResult): Promise<number | undefined> => {
  const correlationId = result.correlationId

  try {
    const queryResult = await db<ErrorListRecord[]>`
      SELECT error_id FROM br7own.error_list WHERE message_id = ${correlationId}`

    return queryResult[0]?.error_id
  } catch (e) {
    const error = e as PostgresError
    if (error.severity !== "NOTICE") {
      console.error(e)
      throw error
    }
  }
}

export default fetchErrorListRecordId
