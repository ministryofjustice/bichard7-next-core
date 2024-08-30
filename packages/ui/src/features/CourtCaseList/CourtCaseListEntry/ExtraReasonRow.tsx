import ConditionalRender from "components/ConditionalRender"
import { Table } from "govuk-react"
import Image from "next/image"
import { LOCKED_ICON_URL } from "utils/icons"
import { StyledExtraReasonRow } from "./ExtraReasonRow.styles"

interface ExtraReasonRowProps {
  isLocked: boolean
  reasonCell: JSX.Element
  lockTag: JSX.Element
}

export const ExtraReasonRow = ({ isLocked, reasonCell, lockTag }: ExtraReasonRowProps) => {
  return (
    <StyledExtraReasonRow>
      <Table.Cell>
        <ConditionalRender isRendered={isLocked}>
          <Image src={LOCKED_ICON_URL} width={20} height={20} alt="Lock icon" />
        </ConditionalRender>
      </Table.Cell>
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell>{reasonCell}</Table.Cell>
      <Table.Cell>{lockTag}</Table.Cell>
    </StyledExtraReasonRow>
  )
}
