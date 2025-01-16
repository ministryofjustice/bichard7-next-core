import type { NoteDto, NoteRow } from "@moj-bichard7/common/types/Note"

import { convertPartialUserRowToDto } from "./convertUserRowToDto"

export const convertNoteRowToDto = (noteRow: NoteRow): NoteDto => {
  const partialUserDto = noteRow.user ? convertPartialUserRowToDto(noteRow.user) : undefined

  return {
    createdAt: noteRow.create_ts,
    noteText: noteRow.note_text,
    user: partialUserDto,
    userFullName: partialUserDto ? partialUserDto.fullname : undefined,
    userId: noteRow.user_id
  } satisfies NoteDto
}
