import styled from "styled-components"
import { gdsMidGrey } from "utils/colours"

const Banner = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  border-bottom: 1px solid ${gdsMidGrey};

  > .govuk-phase-banner {
    border: none;
  }
`

export { Banner }
