import styled from "styled-components"

import { white, gdsMidGrey } from "@/utils/colours"

export const FloatingWrapper = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  background-color: ${white};
  padding: 10px 15px;
  border: 1px solid ${gdsMidGrey};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
  transition:
    opacity 0.2s ease-out,
    visibility 0.2s ease-out;

  a {
    display: inline-flex;
    align-items: center;
  }

  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  @media (max-width: 40.0625em) {
    bottom: 1rem;
    right: 1rem;
  }
`
