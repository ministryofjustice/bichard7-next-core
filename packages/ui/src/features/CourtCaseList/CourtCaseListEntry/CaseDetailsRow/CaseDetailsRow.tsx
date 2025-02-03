import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import { filterUserNotes } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import ResolutionStatusBadge from "features/CourtCaseList/tags/ResolutionStatusBadge"
import Image from "next/image"
import { useRouter } from "next/router"
import { JSX, useState } from "react"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { displayedDateFormat } from "utils/date/formattedDate"
import { LOCKED_ICON_URL } from "utils/icons"
import { ResolutionStatus } from "../../../../types/ResolutionStatus"
import { CaseListResolutionStatusBadgeWrapper } from "./CaseDetailsRow.styles"
import { NotePreviewButton } from "./NotePreviewButton"
import { NotePreviewRow } from "./NotePreviewRow"

interface CaseDetailsRowProps {
  courtCase: DisplayPartialCourtCase
  reasonCell?: JSX.Element | string
  lockTag?: JSX.Element
  resolutionStatus: ResolutionStatus
  isDoubleRow: boolean

  previousPath: string | null
}

export const CaseDetailsRow = ({
  courtCase,
  reasonCell,
  lockTag,
  previousPath,
  resolutionStatus,
  isDoubleRow
}: CaseDetailsRowProps) => {
  const { notes, errorLockedByUsername, defendantName, errorId, courtDate, courtName, ptiurn } = courtCase
  const { basePath } = useRouter()
  const [showPreview, setShowPreview] = useState(true)
  const userNotes = filterUserNotes(notes)
  const numberOfNotes = userNotes.length

  const rowSpan = isDoubleRow ? 2 : 1

  let previousPathWebSafe = ""
  if (previousPath) {
    previousPathWebSafe = `?previousPath=${encodeURIComponent(previousPath)}`
  }

  return (
    <>
      <tr className="govuk-table__row caseDetailsRow">
        <td className="govuk-table__cell" rowSpan={1}>
          <ConditionalRender isRendered={!!errorLockedByUsername}>
            <Image src={LOCKED_ICON_URL} priority width={20} height={20} alt="Lock icon" />
          </ConditionalRender>
        </td>
        <td className="govuk-table__cell" rowSpan={rowSpan}>
          <a href={`${basePath}/court-cases/${errorId}${previousPathWebSafe}`} className="defendant-name govuk-link">
            {defendantName}
            <br />
            <CaseListResolutionStatusBadgeWrapper>
              <ResolutionStatusBadge resolutionStatus={resolutionStatus} />
            </CaseListResolutionStatusBadgeWrapper>
          </a>
        </td>
        <td className="govuk-table__cell" rowSpan={rowSpan}>
          <DateTime date={courtDate} dateFormat={displayedDateFormat} />
        </td>
        <td className="govuk-table__cell" rowSpan={rowSpan}>
          {courtName}
        </td>
        <td className="govuk-table__cell" rowSpan={rowSpan}>
          {ptiurn}
        </td>
        <td className="govuk-table__cell" rowSpan={rowSpan}>
          <NotePreviewButton previewState={showPreview} setShowPreview={setShowPreview} numberOfNotes={numberOfNotes} />
        </td>
        <td className="govuk-table__cell">{reasonCell}</td>
        <td className="govuk-table__cell">{lockTag}</td>
      </tr>
      {notes.length > 0 && !showPreview && <NotePreviewRow notes={notes} />}
    </>
  )
}
