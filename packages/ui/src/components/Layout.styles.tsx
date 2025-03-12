import styled from "styled-components"
import { gdsMidGrey } from "utils/colours"

const Banner = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${gdsMidGrey};
  margin-bottom: 0.7rem;

  > .govuk-phase-banner {
    border: none;
  }
`

export { Banner }
