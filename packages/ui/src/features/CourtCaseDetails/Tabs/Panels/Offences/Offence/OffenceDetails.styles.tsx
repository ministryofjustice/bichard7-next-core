import styled from "styled-components"
import { blue, lightGrey } from "utils/colours"

const OffenceDetailsContainer = styled.div`
  & td {
    width: 50%;
  }
`

const HeaderWrapper = styled.div`
  background-color: ${lightGrey};
  cursor: pointer;
`

const AccordionToggle = styled.div`
  display: flex;
  align-items: center;
  color: ${blue};

  .chevron {
    margin-right: 5px;
  }
`

export { AccordionToggle, HeaderWrapper, OffenceDetailsContainer }
