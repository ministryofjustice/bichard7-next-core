import styled from "styled-components"
import { blue, lightGrey } from "utils/colours"

interface HeaderWrapperProps {
  $clickable?: boolean
}

const HeaderWrapper = styled.div<HeaderWrapperProps>`
  background-color: ${lightGrey};
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
