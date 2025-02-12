import styled from "styled-components"
import { gdsLightGrey } from "utils/colours"

const SummaryBox = styled.aside`
  background-color: ${gdsLightGrey};
  padding: 25px;
  position: sticky;
  top: 0;
  z-index: 9;
  width: 100%;
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
const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
`

export { FlexContainer, SummaryBox, SummaryBoxGrid }
