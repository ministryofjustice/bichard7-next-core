import type { PostgresError, Sql } from "postgres"

import type ErrorListNoteRecord from "../../types/ErrorListNoteRecord"

const insertErrorListNotes = async (db: Sql, error_id: number, notes: (null | string)[]): Promise<void> => {
  try {
    for (const note of notes) {
      if (!note) {
        continue
      }

      const noteRecord: ErrorListNoteRecord = {
        create_ts: new Date(),
        error_id,
        note_text: note,
        user_id: "System"
      }
      await db`
        INSERT INTO br7own.error_list_notes ${db(noteRecord)}`
    }
  } catch (e) {
    const error = e as PostgresError
    if (error.severity !== "NOTICE") {
      console.error(error)
      throw error
    }
  }
}

export default insertErrorListNotes
