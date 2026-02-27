import styled from "styled-components"
import { gdsBlue, gdsBlueHover, gdsYellow, gdsBlack } from "utils/colours"

export const StyledActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  padding: 0 3rem 0.5rem 3rem;

  .govuk-button {
    margin: 0;
  }

  .left-aligned {
    margin-right: auto;
  }
`

// Different from `LinkButton`
export const LinkStyleButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
  display: inline;

  color: ${gdsBlue};
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.1em;

  &:hover {
    color: ${gdsBlueHover};
    text-decoration-thickness: 3px;
  }

  &:focus {
    background-color: ${gdsYellow}; /* govuk-yellow focus */
    color: ${gdsBlack};
    box-shadow:
      0 -2px ${gdsYellow},
      0 4px ${gdsBlack};
    outline: none;
    text-decoration: none;
  }
`
