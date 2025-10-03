import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export default async (
  database: WritableDatabaseConnection,
  caseId: number,
  note: string,
  userId: string
): PromiseResult<boolean> => {
  const createTs = new Date()
  const result = await database.connection`
    INSERT INTO br7own.error_list_notes
      (error_id, note_text, user_id, create_ts)
    VALUES
      (${caseId}, ${note}, ${userId}, ${createTs})
  `.catch((error: Error) => error)

  if (isError(result)) {
    return Error(`Couldn't insert note for case id:${caseId}: ${result.message}`)
  }

  return true
}
