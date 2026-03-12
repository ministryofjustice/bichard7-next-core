import {
  filterUserNotes,
  getMostRecentNote
} from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import { DisplayNote } from "types/display/Notes"
import { NotePreview } from "./NotePreviewButton"
import { TableRow, TableCell } from "components/Table"
import { mergeClassNames } from "helpers/mergeClassNames"

interface NotePreviewRowProps {
  notes: DisplayNote[]
  className?: string
  numberOfNotes: number
  previewState: boolean
  colSpan: number
}

export const NotePreviewRow = ({ notes, className, numberOfNotes, previewState, colSpan }: NotePreviewRowProps) => {
  const userNotes = filterUserNotes(notes)
  const mostRecentUserNote = getMostRecentNote(userNotes)

  return (
    <TableRow className={mergeClassNames("note-preview-row", className)}>
      <TableCell />
      <TableCell colSpan={colSpan}>
        <NotePreview latestNote={mostRecentUserNote} numberOfNotes={numberOfNotes} ariaHidden={!previewState} />
      </TableCell>
    </TableRow>
  )
}
