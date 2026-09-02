import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { TransactionConnection } from "../../../types/DatabaseGateway"

export default async (
  database: TransactionConnection,
  notes: string[],
  userId: string,
  caseId: number
): PromiseResult<void> => {
  const createTs = new Date()
  const mappedNotes = notes.map((note) => ({
    create_ts: createTs,
    error_id: caseId,
    note_text: note,
    user_id: userId
  }))

  const result = await database.connection`
    INSERT INTO br7own.error_list_notes
      ${database.connection(mappedNotes, "error_id", "note_text", "user_id", "create_ts")}
  `.catch((error: Error) => error)

  if (isError(result)) {
    return Error(`Couldn't insert notes for case id:${caseId}: ${result.message}`)
  }
}
