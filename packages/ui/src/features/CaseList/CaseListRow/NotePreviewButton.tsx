import { Preview } from "components/Preview"
import { truncate } from "lodash"
import { Dispatch, SetStateAction } from "react"
import { DisplayNote } from "types/display/Notes"
import ConditionalRender from "../../../components/ConditionalRender"
import { validateMostRecentNoteDate } from "../../CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import { NotePreviewBody, NotePreviewHeader, StyledPreviewButton } from "./NotePreviewButton.styles"

interface NotePreviewProps {
  latestNote: DisplayNote
  numberOfNotes: number
  ariaHidden?: boolean
}

interface NotePreviewButtonProps {
  previewState: boolean
  setShowPreview: Dispatch<SetStateAction<boolean>>
  numberOfNotes: number
}

export const NotePreview = ({ latestNote, numberOfNotes, ariaHidden }: NotePreviewProps) => {
  const displayDate = validateMostRecentNoteDate(latestNote)

  return (
    <Preview id={"note-preview"} aria-hidden={ariaHidden}>
      <NotePreviewHeader className={`govuk-body govuk-!-font-weight-bold note-preview-heading`}>
        {numberOfNotes > 1
          ? `Most recent note added ${displayDate} by ${latestNote.userId}`
          : `Note added ${displayDate} by ${latestNote.userId}`}
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
          ariaControls={"note-preview"}
        />
      </ConditionalRender>
    </>
  )
}
