import styled from "styled-components"

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
`

const SeparatorLine = styled.div`
  position: relative;
  display: block;
  margin-bottom: 1.25rem;
  width: 100%;
  height: 2px;

  &:after {
    content: " ";
    position: absolute;
    height: 2px;
    width: calc(100% + (1.2625rem * 2));
    background: #b1b4b6;
    left: -1.2625rem;
  }
`

export { ButtonContainer, SeparatorLine }
