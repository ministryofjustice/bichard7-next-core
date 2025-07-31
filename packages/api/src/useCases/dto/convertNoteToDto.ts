import type { NoteDto, NoteRow } from "@moj-bichard7/common/types/Note"

import { convertNoteUserRowToNoteUserDto } from "./convertUserToDto"

export const convertNoteToDto = (noteRow: NoteRow): NoteDto => {
  let fullname: string | undefined

  const noteUser = noteRow.user?.username ? convertNoteUserRowToNoteUserDto(noteRow.user) : undefined

  if (noteUser) {
    fullname = `${noteUser.forenames} ${noteUser.surname}`
  }

  return {
    createdAt: noteRow.create_ts,
    noteText: noteRow.note_text,
    user: noteUser,
    userFullName: fullname,
    userId: noteRow.user_id
  }
}
