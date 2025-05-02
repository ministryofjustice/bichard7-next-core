import styled from "styled-components"
import { blue, lightGrey } from "utils/colours"
import { InfoRow } from "../../InfoRow"

const StyledInfoRow = styled(InfoRow)`
  &.result-text .row-value {
    white-space: pre-line;
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

export { AccordionToggle, HeaderWrapper, StyledInfoRow }
