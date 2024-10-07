import { Table } from "govuk-react"
import styled from "styled-components"

const LabelCell = styled(Table.Cell)`
  vertical-align: top;
  & .error-icon {
    padding-top: 0.62rem;
  }
`

export { LabelCell }
