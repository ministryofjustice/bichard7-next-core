import type { AuditCaseDto } from "@moj-bichard7/common/types/AuditCase"
import type Note from "../../services/entities/Note"

import DateTime from "components/DateTime"
import { TableCell, TableRow } from "components/Table"
import { filterUserNotes } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import { useRouter } from "next/router"
import { useState } from "react"
import { displayedDateFormat } from "utils/date/formattedDate"
import { AuditQualityCell } from "features/CaseList/CaseListRow/AuditQualityCell"
import { NotePreviewButton } from "features/CaseList/CaseListRow/NotePreviewButton"
import { NotePreviewRow } from "features/CaseList/CaseListRow/NotePreviewRow"
import { ExceptionQuality } from "@moj-bichard7/common/types/ExceptionQuality"
import { TriggerQuality } from "@moj-bichard7/common/types/TriggerQuality"
import { noteToDisplayNoteDto } from "../../services/dto/noteDto"

interface AuditCaseRowProps {
  auditId: number
  courtCase: AuditCaseDto
}

export const AuditCaseRow = ({ auditId, courtCase }: AuditCaseRowProps) => {
  const {
    asn,
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
  const notes = courtCase.notes.map((note) => noteToDisplayNoteDto(note as Note))
  const numberOfNotes = courtCase.noteCount ?? filterUserNotes(notes).length

  return (
    <>
      <TableRow className="caseDetailsRow">
        <TableCell rowSpan={showPreview ? 2 : 3}>
          <a href={`${basePath}/court-cases/${errorId}?prev=/audit/${auditId}`} className="defendant-name govuk-link">
            {defendantName}
          </a>
        </TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>
          <a href={`${basePath}/court-cases/${errorId}?prev=/audit/${auditId}`} className="asn govuk-link">
            {asn}
          </a>
        </TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>{ptiurn}</TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>{courtName}</TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>
          <DateTime date={courtDate} dateFormat={displayedDateFormat} />
        </TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>{"TODO: Case reference"}</TableCell>
        <TableCell rowSpan={showPreview ? 2 : 3}>
          <DateTime date={messageReceivedTimestamp} dateFormat={displayedDateFormat} />
        </TableCell>
        <TableCell>
          <NotePreviewButton previewState={showPreview} setShowPreview={setShowPreview} numberOfNotes={numberOfNotes} />
        </TableCell>
        <AuditQualityCell
          rowSpan={showPreview ? 2 : 3}
          errorQualityChecked={errorQualityChecked as ExceptionQuality}
          triggerQualityChecked={triggerQualityChecked as TriggerQuality}
          hasExceptions={true}
          hasTriggers={true}
        />
      </TableRow>
      {notes.length > 0 && !showPreview && (
        <NotePreviewRow notes={notes} numberOfNotes={numberOfNotes} previewState={showPreview} />
      )}
    </>
  )
}
