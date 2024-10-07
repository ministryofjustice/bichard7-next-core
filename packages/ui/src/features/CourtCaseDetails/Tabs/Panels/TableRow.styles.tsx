import { HintText, Table } from "govuk-react"
import styled from "styled-components"

const StyledTableRow = styled(Table.Row)`
  & td {
    vertical-align: top;
  }
`

const StyledHintText = styled(HintText)`
  margin-bottom: 0;
`

export { StyledHintText, StyledTableRow }
