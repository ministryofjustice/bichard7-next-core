import ConditionalRender from "components/ConditionalRender"
import { Table } from "govuk-react"
import Image from "next/image"
import { LOCKED_ICON_URL } from "utils/icons"

import { StyledExtraReasonRow } from "./ExtraReasonRow.styles"

interface ExtraReasonRowProps {
  isLocked: boolean
  lockTag: JSX.Element
  reasonCell: JSX.Element
}

export const ExtraReasonRow = ({ isLocked, lockTag, reasonCell }: ExtraReasonRowProps) => {
  return (
    <StyledExtraReasonRow>
      <Table.Cell>
        <ConditionalRender isRendered={isLocked}>
          <Image alt="Lock icon" height={20} src={LOCKED_ICON_URL} width={20} />
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
