import type ErrorListNoteRecord from "phase1/types/ErrorListNoteRecord"
import type { PostgresError, Sql } from "postgres"

const insertErrorListNotes = async (db: Sql, error_id: number, notes: (string | null)[]): Promise<void> => {
  try {
    for (const note of notes) {
      if (!note) {
        continue
      }
      const noteRecord: ErrorListNoteRecord = {
        error_id,
        note_text: note,
        user_id: "System",
        create_ts: new Date()
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
