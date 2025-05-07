import styled from "styled-components"

const StyledEditableFieldRow = styled.div`
  font-size: 1rem;
`

const LabelCell = styled.dt`
  vertical-align: top;
  & .error-icon {
    padding-top: 0.62rem;
  }
`

export { StyledEditableFieldRow, LabelCell }
