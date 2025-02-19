import styled from "styled-components"
import { gdsLightGrey } from "utils/colours"

const SummaryBox = styled.aside`
  background-color: ${gdsLightGrey};
  padding: 0rem, 1rem, 0rem, 1rem;
`

const SummaryBoxGrid = styled.div`
  display: flex;
  grid-template-columns: repeat(3, auto);
  grid-auto-flow: row dense;
  row-gap: 12px;

  @media (min-width: 1680px) {
    display: flex;
    font-size: 19px;
  }
`

export { SummaryBox, SummaryBoxGrid }
