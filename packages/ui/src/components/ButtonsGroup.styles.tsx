import styled from "styled-components"

const StyledButtonsGroup = styled.div<{ noGap: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: ${(props) => (props.noGap ? 0 : "50px")};

  & > * {
    flex: 0 1 1%;
  }

  & > button {
    white-space: nowrap;
  }
`

export { StyledButtonsGroup }
