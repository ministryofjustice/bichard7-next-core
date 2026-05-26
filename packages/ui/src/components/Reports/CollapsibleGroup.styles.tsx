import styled from "styled-components"
import { tagBlue } from "utils/colours"

interface HeaderButtonProps {
  $clickable?: boolean
}

const HeaderButton = styled.button<HeaderButtonProps>`
  background-color: ${tagBlue};
  width: 100%;
  border: none;
  ${({ $clickable }) => $clickable && "cursor: pointer;"}
`

export { HeaderButton }
