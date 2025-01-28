import styled from "styled-components"
import { gdsLightGrey } from "utils/colours"

const SummaryBox = styled.div`
  background-color: ${gdsLightGrey};
  padding: 25px;
  position: sticky;
  top: 40px;
  z-index: 10;
`

const SummaryBoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-auto-flow: row dense;
  row-gap: 12px;

  @media (min-width: 1680px) {
    display: flex;
    font-size: 19px;
  }
`

export { SummaryBox, SummaryBoxGrid }
