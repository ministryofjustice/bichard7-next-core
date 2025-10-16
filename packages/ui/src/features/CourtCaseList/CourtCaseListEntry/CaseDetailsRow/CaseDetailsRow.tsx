import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import { TableCell, TableRow } from "components/Table"
import { filterUserNotes } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import { useRouter } from "next/router"
import { useState } from "react"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { displayedDateFormat } from "utils/date/formattedDate"
import { AuditQualityRow } from "../AuditQualityRow"
import { NotePreviewButton } from "./NotePreviewButton"
import { NotePreviewRow } from "./NotePreviewRow"

interface CaseDetailsRowProps {
  courtCase: DisplayPartialCourtCase
  reasonCell?: React.ReactNode | string
  lockTag?: React.ReactNode
  previousPath: string | null
  displayAuditQuality: boolean
}

export const CaseDetailsRow = ({
  courtCase,
  reasonCell,
  lockTag,
  previousPath,
  displayAuditQuality
}: CaseDetailsRowProps) => {
  const { notes, defendantName, errorId, courtDate, courtName, ptiurn, errorQualityChecked, triggerQualityChecked } =
    courtCase
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
        <ConditionalRender isRendered={displayAuditQuality}>
          <AuditQualityRow
            errorQualityChecked={errorQualityChecked}
            triggerQualityChecked={triggerQualityChecked}
            hasExceptions={courtCase.errorReport !== ""}
            hasTriggers={courtCase.triggerCount > 0}
          />
        </ConditionalRender>
      </TableRow>
      {notes.length > 0 && !showPreview && (
        <NotePreviewRow notes={notes} numberOfNotes={numberOfNotes} previewState={showPreview} />
      )}
    </>
  )
}
