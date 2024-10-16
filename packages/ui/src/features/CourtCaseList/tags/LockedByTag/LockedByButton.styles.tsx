import styled from "styled-components"
import { blue, gdsBlack, tagBlue, textBlue, yellow } from "utils/colours"

const StyledLockedByButton = styled.button`
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
  padding: 8px 18px 8px 8px;
  border: none;
  gap: 11px;
  background-color: ${tagBlue};
  color: ${textBlue};
  font-size: 1em;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: white;
    background: ${blue};
  }
  &:hover img {
    filter: invert(1);
  }
  &:focus {
    color: ${gdsBlack};
    background: ${yellow};
  }
  &:focus img {
    filter: contrast(1);
  }
`

export { StyledLockedByButton }
