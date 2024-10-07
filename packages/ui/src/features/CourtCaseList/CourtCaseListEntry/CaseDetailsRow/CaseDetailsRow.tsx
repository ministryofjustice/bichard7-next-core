import ConditionalRender from "components/ConditionalRender"
import DateTime from "components/DateTime"
import { filterUserNotes } from "features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/CourtCaseListEntryHelperFunction"
import ResolutionStatusBadge from "features/CourtCaseList/tags/ResolutionStatusBadge"
import { Link, Table } from "govuk-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { displayedDateFormat } from "utils/date/formattedDate"
import { LOCKED_ICON_URL } from "utils/icons"
import { ResolutionStatus } from "../../../../types/ResolutionStatus"
import { NotePreviewButton } from "./NotePreviewButton"
import { NotePreviewRow } from "./NotePreviewRow"
import { CaseListResolutionStatusBadgeWrapper } from "./CaseDetailsRow.styles"

interface CaseDetailsRowProps {
  courtCase: DisplayPartialCourtCase
  reasonCell?: JSX.Element | string
  lockTag?: JSX.Element
  resolutionStatus: ResolutionStatus

  previousPath: string | null
}

export const CaseDetailsRow = ({
  courtCase,
  reasonCell,
  lockTag,
  previousPath,
  resolutionStatus
}: CaseDetailsRowProps) => {
  const { notes, errorLockedByUsername, defendantName, errorId, courtDate, courtName, ptiurn } = courtCase
  const { basePath } = useRouter()
  const [showPreview, setShowPreview] = useState(true)
  const userNotes = filterUserNotes(notes)
  const numberOfNotes = userNotes.length

  let previousPathWebSafe = ""
  if (previousPath) {
    previousPathWebSafe = `?previousPath=${encodeURIComponent(previousPath)}`
  }

  return (
    <>
      <Table.Row className="caseDetailsRow">
        <Table.Cell>
          <ConditionalRender isRendered={!!errorLockedByUsername}>
            <Image src={LOCKED_ICON_URL} priority width={20} height={20} alt="Lock icon" />
          </ConditionalRender>
        </Table.Cell>
        <Table.Cell>
          <Link href={`${basePath}/court-cases/${errorId}${previousPathWebSafe}`} className="defendant-name">
            {defendantName}
            <br />
            <CaseListResolutionStatusBadgeWrapper>
              <ResolutionStatusBadge resolutionStatus={resolutionStatus} />
            </CaseListResolutionStatusBadgeWrapper>
          </Link>
        </Table.Cell>
        <Table.Cell>
          <DateTime date={courtDate} dateFormat={displayedDateFormat} />
        </Table.Cell>
        <Table.Cell>{courtName}</Table.Cell>
        <Table.Cell>{ptiurn}</Table.Cell>
        <Table.Cell>
          <NotePreviewButton previewState={showPreview} setShowPreview={setShowPreview} numberOfNotes={numberOfNotes} />
        </Table.Cell>
        <Table.Cell>{reasonCell}</Table.Cell>
        <Table.Cell>{lockTag}</Table.Cell>
      </Table.Row>
      {notes.length > 0 && !showPreview && <NotePreviewRow notes={notes} />}
    </>
  )
}
