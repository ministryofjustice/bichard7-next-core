import styled from "styled-components"
import { blue } from "utils/colours"

const HeaderCellAlt = styled.td`
  border-color: var(--border-input);
`
const HeaderCell = styled.td`
  height: 100%;
  vertical-align: bottom;
  border-color: var(--border-input);
`
const HeaderLink = styled.a`
  color: ${blue};
  display: flex;
  align-items: center;
  &:focus {
    max-width: fit-content;
  }
  &:active {
    color: ${blue};
  }
  &:visited {
    color: ${blue};
  }
  &:hover {
    color: ${blue};
  }
`

export { HeaderCell, HeaderCellAlt, HeaderLink }
