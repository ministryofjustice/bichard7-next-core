import styled from "styled-components"
import { breakpoints } from "types/breakpoints"

const MojNavContainer = styled.div`
  max-width: 100%;
  padding: 0 40px;

  @media (max-width: ${breakpoints.regular}) {
    padding: 0;
  }
`

export { MojNavContainer }
