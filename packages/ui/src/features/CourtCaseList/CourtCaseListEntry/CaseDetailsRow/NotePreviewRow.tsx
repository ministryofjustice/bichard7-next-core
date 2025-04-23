import {
  filterUserNotes,
  getMostRecentNote
} from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import { DisplayNote } from "types/display/Notes"
import { NotePreview } from "./NotePreviewButton"

interface NotePreviewRowProps {
  notes: DisplayNote[]
  className?: string
  numberOfNotes: number
}

export const NotePreviewRow = ({ notes, className, numberOfNotes }: NotePreviewRowProps) => {
  const userNotes = filterUserNotes(notes)
  const mostRecentUserNote = getMostRecentNote(userNotes)
  const classes = ["govuk-table__row", "note-preview-row"]

  if (className) {
    classes.push(className)
  }

  return (
    <tr className={classes.join(" ")}>
      <td className="govuk-table__cell" />
      <td className="govuk-table__cell" />
      <td className="govuk-table__cell" colSpan={2}>
        <NotePreview latestNote={mostRecentUserNote} numberOfNotes={numberOfNotes} />
      </td>
      <td className="govuk-table__cell" />
    </tr>
  )
}
