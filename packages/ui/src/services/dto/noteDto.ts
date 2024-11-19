import type Note from "services/entities/Note"
import type { DisplayNote } from "types/display/Notes"

import { userToDisplayPartialUserDto } from "./userDto"

export const noteToDisplayNoteDto = (note: Note): DisplayNote => {
  const displayNote: DisplayNote = {
    createdAt: note.createdAt.toISOString(),
    noteText: note.noteText,
    userId: note.userId
  }

  if (note.userFullName) {
    displayNote.userFullName = note.userFullName
  }

  if (note.user && note.user.username) {
    displayNote.user = userToDisplayPartialUserDto(note.user)
  }

  return displayNote
}
