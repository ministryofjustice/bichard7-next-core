import type { Note, NoteRow } from "@moj-bichard7/common/types/Note"

import { convertNoteUserRowToNoteUser } from "../../useCases/dto/convertUserToDto"

const mapNoteRowToNote = (noteRow: NoteRow): Note => ({
  createdAt: noteRow.create_ts,
  errorId: noteRow.error_id,
  noteId: noteRow.note_id,
  noteText: noteRow.note_text,
  user: noteRow.user ? convertNoteUserRowToNoteUser(noteRow.user) : undefined,
  userId: noteRow.user_id
})

export default mapNoteRowToNote
