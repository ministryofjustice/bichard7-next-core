import styled from "styled-components"
import { blue, tagBlue } from "utils/colours"

interface HeaderWrapperProps {
  $clickable?: boolean
}

const HeaderWrapper = styled.button<HeaderWrapperProps>`
  background-color: ${tagBlue};
  width: 100%;
  border: none;
  ${({ $clickable }) => $clickable && "cursor: pointer;"}
`

const AccordionToggle = styled.div`
  display: flex;
  align-items: center;
  color: ${blue};

  .chevron {
    margin-right: 0.33rem;
  }
`

export { AccordionToggle, HeaderWrapper }
