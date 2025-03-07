import styled from "styled-components"

const Label = styled.th`
  vertical-align: top;

  & .error-icon {
    padding: 0.62rem 0 0.62rem 0;
  }
`

const Content = styled.td`
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
