import { ResolutionStatus } from "types/ResolutionStatus"
import ResolutionStatusBadge from "../tags/ResolutionStatusBadge"
import { CaseListResolutionStatusBadgeWrapper } from "./CaseDetailsRow/CaseDetailsRow.styles"
import { StyledExtraReasonRow } from "./ExtraReasonRow.styles"

interface ExtraReasonRowProps {
  reasonCell?: React.ReactNode
  lockTag?: React.ReactNode
  resolutionStatus: ResolutionStatus
}

export const ExtraReasonRow = ({ reasonCell, lockTag, resolutionStatus }: ExtraReasonRowProps) => {
  return (
    <StyledExtraReasonRow className={"govuk-table__row extraReasonRow"}>
      <td className="govuk-table__cell resolutionStatusBadgeCell">
        <CaseListResolutionStatusBadgeWrapper>
          <ResolutionStatusBadge resolutionStatus={resolutionStatus} />
        </CaseListResolutionStatusBadgeWrapper>
      </td>
      <td className="govuk-table__cell" />
      <td className="govuk-table__cell extraReasonCell">{reasonCell || ""}</td>
      <td className="govuk-table__cell">{lockTag || ""}</td>
    </StyledExtraReasonRow>
  )
}
