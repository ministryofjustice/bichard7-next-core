import type { Note } from "@moj-bichard7/common/types/Note"
import type postgres from "postgres"

export default async (sql: postgres.Sql, errorIds: number[]): Promise<Note[]> => {
  const result: Note[] = await sql`
    SELECT DISTINCT ON (eln.error_id)
      eln.note_id,
      eln.error_id,
      eln.note_text,
      eln.user_id,
      eln.create_ts
    FROM
      br7own.error_list_notes eln
    WHERE
      eln.error_id = ANY (${errorIds})
      AND (eln.user_id != 'System' OR eln.user_id IS NULL)
    ORDER BY
      eln.error_id,
      eln.create_ts DESC
  `

  return result
}
