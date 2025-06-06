import type { Note, NoteRow } from "@moj-bichard7/common/types/Note"

import { convertNoteUserToNoteUserRow } from "../../useCases/dto/convertUserToDto"

const mapNoteToNoteRow = (note: Note): NoteRow => ({
  create_ts: note.createdAt,
  error_id: note.errorId,
  note_id: note.noteId,
  note_text: note.noteText,
  user: note.user ? convertNoteUserToNoteUserRow(note.user) : undefined,
  user_id: note.userId
})

export default mapNoteToNoteRow
