import { DisplayNote } from "types/display/Notes"
import { formatDisplayedDate } from "../../../../utils/date/formattedDate"

export const filterUserNotes = (notes: DisplayNote[]) => {
  const userNotes = notes.filter((note) => note.userId !== "System")
  return userNotes
}
export const getMostRecentNote = (userNotes: DisplayNote[]) =>
  userNotes.sort((noteA, noteB) => (noteA.createdAt > noteB.createdAt ? -1 : 1))[0]

export const validateMostRecentNoteDate = (mostRecentNote: DisplayNote) => {
  const mostRecentNoteDate = mostRecentNote.createdAt
  const formattedDate = formatDisplayedDate(new Date(mostRecentNoteDate.toString().slice(0, 10)))
  return formattedDate
}
