import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import { filterUserNotes } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { LockReason } from "types/LockReason"
import { displayedDateFormat } from "utils/date/formattedDate"
import { LOCKED_ICON_URL } from "utils/icons"
import { NotePreviewButton } from "./NotePreviewButton"
import { NotePreviewRow } from "./NotePreviewRow"

interface CaseDetailsRowProps {
  courtCase: DisplayPartialCourtCase
  reasonCell?: React.ReactNode | string
  lockTag?: React.ReactNode
  lockReason?: LockReason
  previousPath: string | null
}

export const CaseDetailsRow = ({ courtCase, reasonCell, lockTag, lockReason, previousPath }: CaseDetailsRowProps) => {
  const {
    notes,
    errorLockedByUsername,
    defendantName,
    errorId,
    courtDate,
    courtName,
    ptiurn,
    triggerLockedByUsername
  } = courtCase
  const { basePath } = useRouter()
  const [showPreview, setShowPreview] = useState(true)
  const numberOfNotes = courtCase.noteCount ?? filterUserNotes(notes).length

  let previousPathWebSafe = ""
  if (previousPath) {
    previousPathWebSafe = `?previousPath=${encodeURIComponent(previousPath)}`
  }

  let renderLock = false
  if (
    (lockReason === LockReason.Exceptions && !!errorLockedByUsername) ||
    (lockReason === LockReason.Triggers && !!triggerLockedByUsername)
  ) {
    renderLock = true
  }

  return (
    <>
      <tr className="govuk-table__row caseDetailsRow">
        <td className="govuk-table__cell">
          <ConditionalRender isRendered={renderLock}>
            <Image src={LOCKED_ICON_URL} priority width={20} height={20} alt="Lock icon" />
          </ConditionalRender>
        </td>
        <td className="govuk-table__cell">
          <a href={`${basePath}/court-cases/${errorId}${previousPathWebSafe}`} className="defendant-name govuk-link">
            {defendantName}
          </a>
        </td>
        <td className="govuk-table__cell" rowSpan={showPreview ? 2 : 3}>
          <DateTime date={courtDate} dateFormat={displayedDateFormat} />
        </td>
        <td className="govuk-table__cell" rowSpan={showPreview ? 2 : 3}>
          {courtName}
        </td>
        <td className="govuk-table__cell" rowSpan={showPreview ? 2 : 3}>
          {ptiurn}
        </td>
        <td className="govuk-table__cell">
          <NotePreviewButton previewState={showPreview} setShowPreview={setShowPreview} numberOfNotes={numberOfNotes} />
        </td>
        <td className="govuk-table__cell resonCell">{reasonCell}</td>
        <td className="govuk-table__cell">{lockTag}</td>
      </tr>
      {notes.length > 0 && !showPreview && (
        <NotePreviewRow notes={notes} numberOfNotes={numberOfNotes} previewState={showPreview} />
      )}
    </>
  )
}
