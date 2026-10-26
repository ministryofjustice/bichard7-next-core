import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import { TableCell, TableRow } from "components/Table"
import { AuditQualityCell } from "features/CaseList/CaseListRow/AuditQualityCell"
import { NotePreviewButton } from "features/CaseList/CaseListRow/NotePreviewButton"
import { NotePreviewRow } from "features/CaseList/CaseListRow/NotePreviewRow"
import { filterUserNotes } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import { useRouter } from "next/router"
import { useState } from "react"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { displayedDateFormat } from "utils/date/formattedDate"

interface CaseDetailsRowProps {
  courtCase: DisplayPartialCourtCase
  reasonCell?: React.ReactNode | string
  lockTag?: React.ReactNode
  previousPath: string | null
  displayAuditQuality: boolean
  courtDateReceivedDateMismatch: boolean
  reasonCodes?: string[]
}

export const CaseDetailsRow = ({
  courtCase,
  reasonCell,
  lockTag,
  previousPath,
  displayAuditQuality,
  courtDateReceivedDateMismatch,
  reasonCodes
}: CaseDetailsRowProps) => {
  const {
    notes,
    defendantName,
    errorId,
    courtDate,
    courtName,
    ptiurn,
    errorQualityChecked,
    triggerQualityChecked,
    messageReceivedTimestamp
  } = courtCase
  const { basePath } = useRouter()
  const [showPreview, setShowPreview] = useState(true)
  const numberOfNotes = courtCase.noteCount ?? filterUserNotes(notes).length

  const queryParams = new URLSearchParams()

  if (previousPath) {
    queryParams.append("previousPath", previousPath)
  }

  if (reasonCodes && reasonCodes.length > 0) {
    reasonCodes.forEach((code) => {
      queryParams.append("triggerCodes", code)
    })
  }

  const queryString = queryParams.toString()
  const search = queryString ? `?${queryString}` : ""
  const href = `${basePath}/court-cases/${errorId}${search}`

  const BASE_COLUMNS = 3
  const AUDIT_COLUMNS = 1
  const notePreviewCols = displayAuditQuality ? BASE_COLUMNS + AUDIT_COLUMNS : BASE_COLUMNS

  return (
    <>
      <TableRow className="caseDetailsRow">
        <TableCell>
          <a href={href} className="defendant-name govuk-link">
            {defendantName}
          </a>
        </TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>
          <DateTime date={courtDate} dateFormat={displayedDateFormat} />
        </TableCell>
        <ConditionalRender isRendered={courtDateReceivedDateMismatch}>
          <TableCell rowSpan={showPreview ? 2 : 3}>
            <DateTime date={messageReceivedTimestamp} dateFormat={displayedDateFormat} />
          </TableCell>
        </ConditionalRender>
        <TableCell rowSpan={showPreview ? 2 : 3}>{courtName}</TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>{ptiurn}</TableCell>
        <TableCell>
          <NotePreviewButton previewState={showPreview} setShowPreview={setShowPreview} numberOfNotes={numberOfNotes} />
        </TableCell>
        <TableCell className="resonCell">{reasonCell}</TableCell>
        <TableCell>{lockTag}</TableCell>
        <ConditionalRender isRendered={displayAuditQuality}>
          <AuditQualityCell
            errorQualityChecked={errorQualityChecked}
            triggerQualityChecked={triggerQualityChecked}
            hasExceptions={courtCase.errorReport !== ""}
            hasTriggers={courtCase.triggerCount > 0}
          />
        </ConditionalRender>
      </TableRow>
      {notes.length > 0 && !showPreview && (
        <NotePreviewRow
          notes={notes}
          numberOfNotes={numberOfNotes}
          previewState={showPreview}
          colSpan={notePreviewCols}
        />
      )}
    </>
  )
}
