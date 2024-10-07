import styled from "styled-components"

const StyledButtonsGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 50px;

  & > * {
    flex: 0 1 1%;
  }

  & > button {
    white-space: nowrap;
  }
`

export { StyledButtonsGroup }
