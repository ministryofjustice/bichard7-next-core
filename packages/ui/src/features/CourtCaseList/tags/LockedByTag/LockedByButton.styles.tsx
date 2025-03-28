import styled from "styled-components"
import { blue, gdsBlack, tagBlue, yellow } from "utils/colours"

const StyledLockedByButton = styled.button`
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
  padding: 8px 18px 8px 8px;
  border: none;
  gap: 11px;
  background-color: ${tagBlue};
  color: ${blue};
  font-size: 1em;
  text-decoration: underline;
  cursor: pointer;
  box-shadow: none;
  margin: 0;

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
