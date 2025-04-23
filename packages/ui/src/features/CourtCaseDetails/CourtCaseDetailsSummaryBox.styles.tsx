import styled from "styled-components"
import { lightGrey } from "utils/colours"

const SummaryBox = styled.aside`
  background-color: ${lightGrey};
  padding: 0rem, 1rem, 0rem, 1rem;
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
