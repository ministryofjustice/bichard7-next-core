import ConditionalRender from "components/ConditionalRender"
import Image from "next/image"
import { ResolutionStatus } from "types/ResolutionStatus"
import { LOCKED_ICON_URL } from "utils/icons"
import ResolutionStatusBadge from "../tags/ResolutionStatusBadge"
import { CaseListResolutionStatusBadgeWrapper } from "./CaseDetailsRow/CaseDetailsRow.styles"
import { StyledExtraReasonRow } from "./ExtraReasonRow.styles"

interface ExtraReasonRowProps {
  isLocked: boolean
  reasonCell?: React.ReactNode
  lockTag?: React.ReactNode
  resolutionStatus: ResolutionStatus
}

export const ExtraReasonRow = ({ isLocked, reasonCell, lockTag, resolutionStatus }: ExtraReasonRowProps) => {
  return (
    <StyledExtraReasonRow className={"govuk-table__row extraReasonRow"}>
      <td className="govuk-table__cell">
        <ConditionalRender isRendered={isLocked}>
          <Image src={LOCKED_ICON_URL} width={20} height={20} alt="Lock icon" />
        </ConditionalRender>
      </td>
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
