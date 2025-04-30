import styled from "styled-components"
import { InfoRow } from "../../InfoRow"
import { lightGrey } from "utils/colours"

const StyledInfoRow = styled(InfoRow)`
  &.result-text .row-value {
    white-space: pre-line;
  }
`

const HeaderWrapper = styled.div`
  background-color: ${lightGrey};
`

export { StyledInfoRow, HeaderWrapper }
