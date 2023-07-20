import type { Sql } from "postgres"
import type { PromiseResult } from "src/comparison/types"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import fetchErrorListRecordId from "./fetchErrorListRecordId"
import { default as insertErrorListNotes } from "./insertErrorListNotes"
import insertErrorListRecord from "./insertErrorListRecord"
import updateErrorListRecord from "./updateErrorListRecord"

const saveErrorListRecord = async (db: Sql, result: Phase1SuccessResult): PromiseResult<void> => {
  const recordId = await fetchErrorListRecordId(db, result)
  if (recordId !== undefined) {
    await updateErrorListRecord(db, recordId, result)
    // await insertErrorListNotes(db, recordId, result)
  } else {
    const newRecordId = await insertErrorListRecord(db, result)
    await insertErrorListNotes(db, newRecordId, result)
  }
}

export default saveErrorListRecord
