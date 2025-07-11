import styled from "styled-components"
import { blue } from "utils/colours"

const HeaderCellAlt = styled.th`
  border-color: var(--border-input);
`
const HeaderCell = styled.th`
  height: 100%;
  vertical-align: bottom;
  border-color: var(--border-input);
`

const HeaderButton = styled.button`
  color: ${blue};
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  &:focus {
    max-width: fit-content;
  }
  &:active,
  &:visited,
  &:hover {
    color: ${blue};
  }
`

export { HeaderButton, HeaderCell, HeaderCellAlt }
