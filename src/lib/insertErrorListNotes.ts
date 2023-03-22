import type { PostgresError, Sql } from "postgres"
import type ErrorListNoteRecord from "src/types/ErrorListNoteRecord"
import type Exception from "src/types/Exception"
import type { Phase1SuccessResult } from "src/types/Phase1Result"
import type { Trigger } from "src/types/Trigger"

const generateExceptionsNoteText = (result: Phase1SuccessResult): string => {
  const counts = result.hearingOutcome.Exceptions.reduce((acc: Record<string, number>, e: Exception) => {
    if (!acc[e.code]) {
      acc[e.code] = 0
    }
    acc[e.code] += 1
    return acc
  }, {})
  const segments = Object.keys(counts)
    .sort()
    .map((code) => `${counts[code]} x ${code}`)
  return `Error codes: ${segments.join(", ")}.`
}

const generateTriggersNoteText = (result: Phase1SuccessResult): string => {
  const counts = result.triggers.reduce((acc: Record<string, number>, e: Trigger) => {
    if (!acc[e.code]) {
      acc[e.code] = 0
    }
    acc[e.code] += 1
    return acc
  }, {})
  const segments = Object.keys(counts)
    .sort()
    .map((code) => `${counts[code]} x ${code}`)
  return `Trigger codes: ${segments.join(", ")}.`
}

const insertErrorListRecord = async (sql: Sql, error_id: number, result: Phase1SuccessResult): Promise<void> => {
  const notesText = [generateTriggersNoteText(result), generateExceptionsNoteText(result)]
  try {
    for (const noteText of notesText) {
      const noteRecord: ErrorListNoteRecord = {
        error_id,
        note_text: noteText,
        user_id: "System",
        create_ts: new Date()
      }
      await sql`
        INSERT INTO br7own.error_list_notes ${sql(noteRecord)}`
    }
  } catch (e) {
    const error = e as PostgresError
    if (error.severity !== "NOTICE") {
      console.error(error)
      throw error
    }
  }
}

export default insertErrorListRecord
