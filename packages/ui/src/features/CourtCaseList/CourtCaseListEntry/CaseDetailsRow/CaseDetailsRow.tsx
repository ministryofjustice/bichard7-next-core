import DateTime from "components/DateTime"
import { TableRow, TableCell } from "components/Table"
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
      <TableRow className="caseDetailsRow">
        <TableCell>
          <a href={`${basePath}/court-cases/${errorId}${previousPathWebSafe}`} className="defendant-name govuk-link">
            {defendantName}
          </a>
        </TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>
          <DateTime date={courtDate} dateFormat={displayedDateFormat} />
        </TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>{courtName}</TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>{ptiurn}</TableCell>
        <TableCell>
          <NotePreviewButton previewState={showPreview} setShowPreview={setShowPreview} numberOfNotes={numberOfNotes} />
        </TableCell>
        <TableCell className="resonCell">{reasonCell}</TableCell>
        <TableCell>{lockTag}</TableCell>
      </TableRow>
      {notes.length > 0 && !showPreview && (
        <NotePreviewRow notes={notes} numberOfNotes={numberOfNotes} previewState={showPreview} />
      )}
    </>
  )
}
