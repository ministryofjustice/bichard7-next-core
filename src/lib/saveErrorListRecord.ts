import type { Sql } from "postgres"
import type { PromiseResult } from "src/comparison/types"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import getErrorListRecord from "./getErrorListRecord"
import { default as insertErrorListNotes } from "./insertErrorListNotes"
import insertErrorListRecord from "./insertErrorListRecord"

const saveErrorListRecord = async (db: Sql, result: Phase1SuccessResult): PromiseResult<void> => {
  // Check for existing record
  const existingRecord = await getErrorListRecord(db, result)
  if (existingRecord !== undefined) {
    // await updateErrorListRecord(db, result)
    // await insertErrorListNotes(db, recordId, result)
  } else {
    const recordId = await insertErrorListRecord(db, result)
    await insertErrorListNotes(db, recordId, result)
  }
}

export default saveErrorListRecord
