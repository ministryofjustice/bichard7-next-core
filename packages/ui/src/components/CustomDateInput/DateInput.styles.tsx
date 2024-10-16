import styled from "styled-components"
import { blue, gdsBlack, yellow } from "utils/colours"

const SmallButton = styled.button`
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
  padding: 0px;
  border: none;
  background-color: white;
  gap: 11px;
  color: ${blue};
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

export { SmallButton }
