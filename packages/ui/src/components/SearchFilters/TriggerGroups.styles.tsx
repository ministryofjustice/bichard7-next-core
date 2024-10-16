import styled from "styled-components"

const ScrollableFieldset = styled.fieldset`
  overflow-y: scroll;
  max-height: 400px;
  margin-left: -20px;
  padding-left: 20px;

  > div {
    margin-bottom: 5px;
  }
`

export { ScrollableFieldset }
