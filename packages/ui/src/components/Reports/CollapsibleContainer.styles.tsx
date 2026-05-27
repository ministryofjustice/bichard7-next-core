import styled from "styled-components"
import { gdsTagBlue, tagBlue } from "utils/colours"

interface HeaderButtonProps {
  $clickable?: boolean
  $headerType: "h3" | "h4"
}

const HeaderButton = styled.button<HeaderButtonProps>`
  background-color: ${({ $headerType }) => ($headerType === "h3" ? tagBlue : gdsTagBlue)};
  width: 100%;
  border: none;
  ${({ $clickable }) => $clickable && "cursor: pointer;"}
`

export { HeaderButton }
