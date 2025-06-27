import styled from "styled-components"
import { breakpoints } from "types/breakpoints"

export const StyledLinkButton = styled.a`
  @media (max-width: ${breakpoints.compact}) {
    font-size: 1rem;
  }
`
