import { ResolutionStatus } from "types/ResolutionStatus"
import ResolutionStatusBadge from "../tags/ResolutionStatusBadge"
import { CaseListResolutionStatusBadgeWrapper } from "./CaseDetailsRow/CaseDetailsRow.styles"
import { StyledExtraReasonRow } from "./ExtraReasonRow.styles"
import { TableCell } from "components/Table"

interface ExtraReasonRowProps {
  reasonCell?: React.ReactNode
  lockTag?: React.ReactNode
  resolutionStatus: ResolutionStatus
}

export const ExtraReasonRow = ({ reasonCell, lockTag, resolutionStatus }: ExtraReasonRowProps) => {
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
    </StyledExtraReasonRow>
  )
}
