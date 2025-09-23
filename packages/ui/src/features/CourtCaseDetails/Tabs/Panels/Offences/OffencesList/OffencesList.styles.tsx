import styled from "styled-components"
import { TableHead } from "components/Table"

export const ScreenReaderOnly = styled.span`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
`

export const StyledTableHead = styled(TableHead)`
  th {
    font-size: var(--case-details-default-font-size);
  }
`
