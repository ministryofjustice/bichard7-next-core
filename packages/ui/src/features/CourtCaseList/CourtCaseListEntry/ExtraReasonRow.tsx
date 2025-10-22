import ConditionalRender from "components/ConditionalRender"
import { TableCell } from "components/Table"
import { ResolutionStatus } from "types/ResolutionStatus"
import ResolutionStatusBadge from "../tags/ResolutionStatusBadge"
import { CaseListResolutionStatusBadgeWrapper } from "./CaseDetailsRow/CaseDetailsRow.styles"
import { StyledExtraReasonRow } from "./ExtraReasonRow.styles"

interface ExtraReasonRowProps {
  reasonCell?: React.ReactNode
  lockTag?: React.ReactNode
  resolutionStatus: ResolutionStatus
  displayAuditQuality: boolean
}

export const ExtraReasonRow = ({ reasonCell, lockTag, resolutionStatus, displayAuditQuality }: ExtraReasonRowProps) => {
  return (
    <StyledExtraReasonRow className={"extraReasonRow"}>
      <TableCell className="resolutionStatusBadgeCell">
        <CaseListResolutionStatusBadgeWrapper>
          <ResolutionStatusBadge resolutionStatus={resolutionStatus} />
        </CaseListResolutionStatusBadgeWrapper>
      </TableCell>
      <TableCell />
      <TableCell className="extraReasonCell">{reasonCell || ""}</TableCell>
      <TableCell>{lockTag || ""}</TableCell>
      <ConditionalRender isRendered={displayAuditQuality}>
        <TableCell>{""}</TableCell>
      </ConditionalRender>
    </StyledExtraReasonRow>
  )
}
