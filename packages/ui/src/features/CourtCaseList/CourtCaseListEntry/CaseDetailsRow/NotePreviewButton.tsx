import { Preview } from "components/Preview"
import { truncate } from "lodash"
import { Dispatch, SetStateAction } from "react"
import { DisplayNote } from "types/display/Notes"
import ConditionalRender from "../../../../components/ConditionalRender"
import { validateMostRecentNoteDate } from "./CourtCaseListEntryHelperFunction"
import { NotePreviewBody, NotePreviewHeader, StyledPreviewButton } from "./NotePreviewButton.styles"

interface NotePreviewProps {
  latestNote: DisplayNote
  numberOfNotes: number
}

interface NotePreviewButtonProps {
  previewState: boolean
  setShowPreview: Dispatch<SetStateAction<boolean>>
  numberOfNotes: number
}

export const NotePreview = ({ latestNote, numberOfNotes }: NotePreviewProps) => {
  const displayDate = validateMostRecentNoteDate(latestNote)

  return (
    <Preview>
      <NotePreviewHeader className={`govuk-body govuk-!-font-weight-bold note-preview-heading`}>
        {numberOfNotes > 1 ? `Most recent note added ${displayDate}` : `Note added ${displayDate}`}
      </NotePreviewHeader>
      <NotePreviewBody className={`note-preview-body`}>
        {truncate(latestNote?.noteText, { length: 103 })}
      </NotePreviewBody>
    </Preview>
  )
}

export const NotePreviewButton: React.FC<NotePreviewButtonProps> = (props: NotePreviewButtonProps) => {
  const buttonText = props.numberOfNotes > 1 ? `${props.numberOfNotes} notes` : `${props.numberOfNotes} note`

  return (
    <>
      <ConditionalRender isRendered={props.numberOfNotes > 0}>
        <StyledPreviewButton
          showPreview={props.previewState}
          onClick={props.setShowPreview}
          previewLabel={buttonText}
          hideLabel={buttonText}
        />
      </ConditionalRender>
    </>
  )
}
