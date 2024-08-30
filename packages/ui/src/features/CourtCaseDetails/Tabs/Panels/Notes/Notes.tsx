import ConditionalRender from "components/ConditionalRender"
import NotesFilterOptions from "components/NotesFilterOptions"
import { useCourtCase } from "context/CourtCaseContext"
import { Paragraph } from "govuk-react"
import { useState } from "react"
import type NotesViewOption from "types/NotesViewOption"
import { DisplayNote } from "types/display/Notes"
import { NotesTable } from "../../../../../components/NotesTable"
import { CourtCaseDetailsPanel } from "../../CourtCaseDetailsPanels"
import AddNoteForm from "./AddNoteForm"

interface NotesProps {
  visible: boolean
  isLockedByCurrentUser: boolean
}

const filterNotes = (notes: DisplayNote[], viewOption?: NotesViewOption) => {
  let noNoteText = "notes"
  let filteredNotes: DisplayNote[] = []
  switch (viewOption) {
    case "View system notes":
      noNoteText = "system notes"
      filteredNotes = notes.filter(({ userId }) => userId === "System")
      break
    case "View user notes":
      noNoteText = "user notes"
      filteredNotes = notes.filter(({ userId }) => userId !== "System")
      break
    default:
      filteredNotes = notes
      break
  }

  return [filteredNotes, noNoteText] as const
}

export const Notes = ({ visible, isLockedByCurrentUser }: NotesProps) => {
  const { courtCase } = useCourtCase()
  const notes: DisplayNote[] = courtCase.notes

  const [viewOption, setViewOption] = useState<NotesViewOption | undefined>()
  const [filteredNotes, noNoteText] = filterNotes(notes, viewOption)
  const hasNotes = notes.length > 0
  const hasFilteredNotes = filteredNotes.length > 0

  return (
    <CourtCaseDetailsPanel visible={visible} heading={"Notes"}>
      <NotesFilterOptions dispatch={setViewOption} selectedOption={viewOption} />
      <ConditionalRender isRendered={hasNotes}>
        <NotesTable notes={filteredNotes} />
      </ConditionalRender>
      <ConditionalRender isRendered={!hasFilteredNotes}>
        <Paragraph>{`Case has no ${noNoteText}.`}</Paragraph>
      </ConditionalRender>
      <AddNoteForm isLockedByCurrentUser={isLockedByCurrentUser} />
    </CourtCaseDetailsPanel>
  )
}
