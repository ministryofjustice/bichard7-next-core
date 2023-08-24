import type { PostgresError, Sql } from "postgres"
import type ErrorListRecord from "../../phase1/types/ErrorListRecord"

const fetchErrorListRecordId = async (db: Sql, correlationId: string): Promise<number | undefined> => {
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
