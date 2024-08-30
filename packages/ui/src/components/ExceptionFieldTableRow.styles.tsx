import { Table } from "govuk-react"
import styled from "styled-components"

const Label = styled(Table.Cell)`
  vertical-align: top;

  & .error-icon {
    padding: 0.62rem 0 0.62rem 0;
  }
`

const Content = styled(Table.Cell)`
  vertical-align: top;

  & .badge-wrapper {
    padding-bottom: 0.62rem;
    display: flex;
    gap: 0.62rem;
    align-items: center;
  }

  & .field-value {
    padding-bottom: 0.62rem;
  }
`
export { Content, Label }
