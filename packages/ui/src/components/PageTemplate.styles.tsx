import styled from "styled-components"
import { breakpoints } from "types/breakpoints"

const GovukWidthContainer = styled.div`
  max-width: 100%;
  padding: 30px 40px;

  @media (max-width: ${breakpoints.regular}) {
    padding: 0;
  }
`

export { GovukWidthContainer }
