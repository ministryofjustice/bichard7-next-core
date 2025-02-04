import ConditionalRender from "components/ConditionalRender"
import Image from "next/image"
import { LOCKED_ICON_URL } from "utils/icons"
import { StyledExtraReasonRow } from "./ExtraReasonRow.styles"
import { JSX } from "react"
import { ResolutionStatus } from "types/ResolutionStatus"
import ResolutionStatusBadge from "../tags/ResolutionStatusBadge"
import { CaseListResolutionStatusBadgeWrapper } from "./CaseDetailsRow/CaseDetailsRow.styles"

interface ExtraReasonRowProps {
  isLocked: boolean
  reasonCell?: JSX.Element
  lockTag?: JSX.Element
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
      <td className="govuk-table__cell extraReasonCell">{reasonCell || ""}</td>
      <td className="govuk-table__cell">{lockTag || ""}</td>
    </StyledExtraReasonRow>
  )
}
