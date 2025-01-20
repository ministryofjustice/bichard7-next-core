import type { Note, NoteDto, NoteUserDto } from "@moj-bichard7/common/types/Note"

import { convertUserForNoteToDto } from "./convertUserToDto"

export const convertNoteToDto = (note: Note): NoteDto => {
  let fullname: string | undefined

  const noteUser: NoteUserDto | undefined = note.user ? convertUserForNoteToDto(note.user) : undefined

  if (noteUser) {
    fullname = `${noteUser.forenames} ${noteUser.surname}`
  }

  return {
    createdAt: note.create_ts,
    noteText: note.note_text,
    user: noteUser,
    userFullName: fullname,
    userId: note.user_id
  } satisfies NoteDto
}
