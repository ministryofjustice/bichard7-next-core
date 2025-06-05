import type { Note, NoteRow } from "@moj-bichard7/common/types/Note"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import mapNoteRowToNote from "../mapNoteRowToNote"

export default async (database: DatabaseConnection, caseIds: number[]): PromiseResult<Note[]> => {
  const result = await database.connection<NoteRow[]>`
    SELECT DISTINCT ON (eln.error_id)
      eln.note_id,
      eln.error_id,
      eln.note_text,
      eln.user_id,
      eln.create_ts
    FROM
      br7own.error_list_notes eln
    WHERE
      eln.error_id = ANY (${caseIds})
      AND (eln.user_id != 'System' OR eln.user_id IS NULL)
    ORDER BY
      eln.error_id,
      eln.create_ts DESC
  `.catch((error: Error) => error)

  if (isError(result)) {
    return Error(`Error while fetching notes for case ids ${caseIds}: ${result.message}`)
  }

  return result.map(mapNoteRowToNote)
}
