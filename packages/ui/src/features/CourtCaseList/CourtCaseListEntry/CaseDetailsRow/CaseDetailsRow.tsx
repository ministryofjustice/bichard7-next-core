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
import { CaseListResolutionStatusBadgeWrapper } from "./CaseDetailsRow.styles"
import { NotePreviewButton } from "./NotePreviewButton"
import { NotePreviewRow } from "./NotePreviewRow"

interface CaseDetailsRowProps {
  courtCase: DisplayPartialCourtCase
  lockTag?: JSX.Element
  previousPath: null | string
  reasonCell?: JSX.Element | string

  resolutionStatus: ResolutionStatus
}

export const CaseDetailsRow = ({
  courtCase,
  lockTag,
  previousPath,
  reasonCell,
  resolutionStatus
}: CaseDetailsRowProps) => {
  const { courtDate, courtName, defendantName, errorId, errorLockedByUsername, notes, ptiurn } = courtCase
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
            <Image alt="Lock icon" height={20} priority src={LOCKED_ICON_URL} width={20} />
          </ConditionalRender>
        </Table.Cell>
        <Table.Cell>
          <Link className="defendant-name" href={`${basePath}/court-cases/${errorId}${previousPathWebSafe}`}>
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
          <NotePreviewButton numberOfNotes={numberOfNotes} previewState={showPreview} setShowPreview={setShowPreview} />
        </Table.Cell>
        <Table.Cell>{reasonCell}</Table.Cell>
        <Table.Cell>{lockTag}</Table.Cell>
      </Table.Row>
      {notes.length > 0 && !showPreview && <NotePreviewRow notes={notes} />}
    </>
  )
}
