import type { NoteDto, NoteRow } from "@moj-bichard7/common/types/Note"

import { NoteRowSchema } from "@moj-bichard7/common/types/Note"

import { convertNoteUserRowToNoteUserDto } from "./convertUserToDto"

export const convertNoteToDto = (noteRow: NoteRow): NoteDto => {
  const parsedNoteRow = NoteRowSchema.parse(noteRow)
  let fullname: string | undefined

  const noteUser = parsedNoteRow.user?.username ? convertNoteUserRowToNoteUserDto(parsedNoteRow.user) : undefined

  if (noteUser) {
    fullname = `${noteUser.forenames} ${noteUser.surname}`
  }

  return {
    createdAt: parsedNoteRow.create_ts.toISOString(),
    noteText: parsedNoteRow.note_text,
    user: noteUser,
    userFullName: fullname,
    userId: parsedNoteRow.user_id
  }
}
