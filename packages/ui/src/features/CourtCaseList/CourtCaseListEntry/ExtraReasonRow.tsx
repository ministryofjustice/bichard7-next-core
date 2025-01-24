import ConditionalRender from "components/ConditionalRender"
import Image from "next/image"
import { LOCKED_ICON_URL } from "utils/icons"
import { StyledExtraReasonRow } from "./ExtraReasonRow.styles"
import { JSX } from "react"

interface ExtraReasonRowProps {
  isLocked: boolean
  reasonCell: JSX.Element
  lockTag: JSX.Element
}

export const ExtraReasonRow = ({ isLocked, reasonCell, lockTag }: ExtraReasonRowProps) => {
  return (
    <StyledExtraReasonRow className={"govuk-table__row"}>
      <td className="govuk-table__cell">
        <ConditionalRender isRendered={isLocked}>
          <Image src={LOCKED_ICON_URL} width={20} height={20} alt="Lock icon" />
        </ConditionalRender>
      </td>
      <td className="govuk-table__cell" />
      <td className="govuk-table__cell" />
      <td className="govuk-table__cell" />
      <td className="govuk-table__cell" />
      <td className="govuk-table__cell" />
      <td className="govuk-table__cell">{reasonCell}</td>
      <td className="govuk-table__cell">{lockTag}</td>
    </StyledExtraReasonRow>
  )
}
