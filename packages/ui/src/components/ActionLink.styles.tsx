import styled from "styled-components"
import { blue } from "utils/colours"

const ActionLinkButton = styled.button`
  background: none;
  border: none;
  color: ${blue};
  cursor: pointer;
  padding: 0;
  text-align: left;
  text-decoration: underline;
  font-size: inherit;
`

export { ActionLinkButton }
