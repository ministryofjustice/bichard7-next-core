import {
  filterUserNotes,
  getMostRecentNote
} from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import { Table } from "govuk-react"
import { DisplayNote } from "types/display/Notes"
import { NotePreview } from "./NotePreviewButton"

interface NotePreviewRowProps {
  notes: DisplayNote[]
  className?: string
}

export const NotePreviewRow = ({ notes, className }: NotePreviewRowProps) => {
  const userNotes = filterUserNotes(notes)
  const mostRecentUserNote = getMostRecentNote(userNotes)
  const numberOfNotes = userNotes.length
  const classes = ["note-preview-row"]

  if (className) {
    classes.push(className)
  }

  return (
    <>
      <Table.Row className={classes.join(" ")}>
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell />
        <Table.Cell colSpan={2}>
          <NotePreview latestNote={mostRecentUserNote} numberOfNotes={numberOfNotes} />
        </Table.Cell>
        <Table.Cell />
        <Table.Cell />
      </Table.Row>
    </>
  )
}
