import styled from "styled-components"
import { InfoRow } from "../../InfoRow"
import { blue, lightGrey } from "utils/colours"

const StyledInfoRow = styled(InfoRow)`
  &.result-text .row-value {
    white-space: pre-line;
  }
`

const HeaderWrapper = styled.div`
  background-color: ${lightGrey};
`

const AccordionToggle = styled.div`
  display: flex;
  align-items: center;
  color: ${blue};

  .chevron {
    margin-right: 5px;
  }
`

export { StyledInfoRow, HeaderWrapper, AccordionToggle }
