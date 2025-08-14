import DateTime from "components/DateTime"
import { filterUserNotes } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import { useRouter } from "next/router"
import { useState } from "react"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { displayedDateFormat } from "utils/date/formattedDate"
import { NotePreviewButton } from "./NotePreviewButton"
import { NotePreviewRow } from "./NotePreviewRow"

interface CaseDetailsRowProps {
  courtCase: DisplayPartialCourtCase
  reasonCell?: React.ReactNode | string
  lockTag?: React.ReactNode
  previousPath: string | null
}

export const CaseDetailsRow = ({ courtCase, reasonCell, lockTag, previousPath }: CaseDetailsRowProps) => {
  const { notes, defendantName, errorId, courtDate, courtName, ptiurn } = courtCase
  const { basePath } = useRouter()
  const [showPreview, setShowPreview] = useState(true)
  const numberOfNotes = courtCase.noteCount ?? filterUserNotes(notes).length

  let previousPathWebSafe = ""
  if (previousPath) {
    previousPathWebSafe = `?previousPath=${encodeURIComponent(previousPath)}`
  }

  return (
    <>
      <tr className="govuk-table__row caseDetailsRow">
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
